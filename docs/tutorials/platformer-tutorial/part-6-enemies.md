---
sidebar_position: 7
---

# Part 6: Enemies and Simple AI

Our platformer has movement, physics, collectibles, and scoring — but nothing pushes back. In this part we'll add **patrolling enemies** the player can stomp (or be sent home by), and the best part: every new mechanic is built from a pattern you've already learned in this series.

## What We'll Accomplish

By the end of this part, you'll have:
- An `Enemy` class with patrol AI that walks between bounds and turns around
- A **head sensor** on enemies — the mirror image of the player's foot sensor from Part 3
- Stomp-to-defeat: land on an enemy for points and a bounce
- Side-hit consequences: touch an enemy and the player respawns
- A new collision category wired into the filtering system from Part 2

## Prerequisites

- Completed [Part 5: Game Mechanics](./part-5-mechanics) (or start from the [Part 5 checkpoint](https://github.com/Cocos2D-Mono/cocos2d-mono-samples/tree/main/Tutorial%20Samples/Platformer/Checkpoints/Part%205))

## Step 1: A New Collision Category

Enemies need their own lane in the collision-filtering system. Add one line to `PhysicsHelper.cs`:

```csharp
// Categories for collision filtering
public const ushort CATEGORY_PLAYER = 0x0001;
public const ushort CATEGORY_PLATFORM = 0x0002;
public const ushort CATEGORY_COLLECTIBLE = 0x0004;
public const ushort CATEGORY_ENEMY = 0x0008;
```

And let the player's body fixture collide with it — in `Player.cs`, extend the mask:

```csharp
// Set collision filtering
fixtureDef.filter.categoryBits = PhysicsHelper.CATEGORY_PLAYER;
fixtureDef.filter.maskBits = PhysicsHelper.CATEGORY_PLATFORM | PhysicsHelper.CATEGORY_COLLECTIBLE | PhysicsHelper.CATEGORY_ENEMY;
```

## Step 2: The Enemy Class

Create `Enemy.cs`. Structurally it's a cousin of `Player`: a dynamic Box2D body under a sprite, plus a thin sensor box — except the sensor sits on the enemy's **head**, because that's where stomps happen.

```csharp
using System;
using Cocos2D;
using Box2D.Dynamics;
using Box2D.Common;
using Box2D.Collision.Shapes;
using CocosDenshion;

namespace Platformer
{
    public class Enemy : CCSprite
    {
        // Physics body
        private b2Body _body;

        // Patrol parameters
        private const float PATROL_SPEED = 2.0f;
        private readonly float _patrolMinX;
        private readonly float _patrolMaxX;
        private int _direction = 1; // 1 = right, -1 = left

        private bool _isDefeated;

        public bool IsDefeated { get { return _isDefeated; } }

        public Enemy(b2World world, float x, float y, float patrolMinX, float patrolMaxX)
            : base("player_idle")
        {
            // Placeholder art: reuse the player sprite with a red tint.
            // In a real game, swap in dedicated enemy artwork.
            Color = new CCColor3B(230, 60, 60);

            _patrolMinX = patrolMinX;
            _patrolMaxX = patrolMaxX;

            // Create physics body (dynamic, like the player: it walks and falls)
            b2BodyDef bodyDef = new b2BodyDef();
            bodyDef.type = b2BodyType.b2_dynamicBody;
            bodyDef.fixedRotation = true;
            bodyDef.allowSleep = false;
            bodyDef.position = new b2Vec2(x / PhysicsHelper.PTM_RATIO, y / PhysicsHelper.PTM_RATIO);

            _body = world.CreateBody(bodyDef);

            // Body fixture - collides with platforms and the player
            b2PolygonShape shape = new b2PolygonShape();
            shape.SetAsBox(
                ContentSize.Width * 0.4f / PhysicsHelper.PTM_RATIO,
                ContentSize.Height * 0.45f / PhysicsHelper.PTM_RATIO);

            b2FixtureDef fixtureDef = new b2FixtureDef();
            fixtureDef.shape = shape;
            fixtureDef.density = 1.0f;
            fixtureDef.friction = 0.2f;
            fixtureDef.restitution = 0.0f;
            fixtureDef.filter.categoryBits = PhysicsHelper.CATEGORY_ENEMY;
            fixtureDef.filter.maskBits = PhysicsHelper.CATEGORY_PLATFORM | PhysicsHelper.CATEGORY_PLAYER;

            _body.CreateFixture(fixtureDef).UserData = this;

            // Head sensor - the player defeats the enemy by landing on this.
            // Mirrors the player's foot sensor from Part 3: a thin sensor box,
            // this time sitting on TOP of the body.
            b2PolygonShape headShape = new b2PolygonShape();
            headShape.SetAsBox(
                ContentSize.Width * 0.3f / PhysicsHelper.PTM_RATIO,
                0.1f / PhysicsHelper.PTM_RATIO,
                new b2Vec2(0, ContentSize.Height * 0.45f / PhysicsHelper.PTM_RATIO),
                0);

            b2FixtureDef headFixtureDef = new b2FixtureDef();
            headFixtureDef.shape = headShape;
            headFixtureDef.isSensor = true;

            b2Fixture headSensor = _body.CreateFixture(headFixtureDef);
            headSensor.UserData = new HeadSensorUserData(this);
        }

        public void Update(float dt)
        {
            if (_isDefeated)
                return;

            // Sync the sprite with the physics body
            Position = PhysicsHelper.ToCocosVector(_body.Position);

            // Patrol AI: walk in the current direction, turn around at the bounds
            if (Position.X <= _patrolMinX)
                _direction = 1;
            else if (Position.X >= _patrolMaxX)
                _direction = -1;

            _body.LinearVelocity = new b2Vec2(PATROL_SPEED * _direction, _body.LinearVelocity.y);

            // Face the direction of travel
            FlipX = _direction < 0;
        }

        public void Defeat(GameLayer gameLayer)
        {
            if (_isDefeated)
                return;

            _isDefeated = true;

            // Remove from the physics world (same pattern as Collectible.Collect)
            _body.World.DestroyBody(_body);
            _body = null;

            // Squash, fade, and remove the sprite
            RunAction(new CCSequence(
                new CCScaleTo(0.15f, 1.3f, 0.4f),
                new CCFadeOut(0.25f),
                new CCCallFunc(() => RemoveFromParent())
            ));

            // Reuse the landing sound as a defeat thump; a real game would
            // use a dedicated effect here.
            CCSimpleAudioEngine.SharedEngine.PlayEffect("land");

            gameLayer.IncreaseScore(25);
        }

        // User data for the head sensor - lets the contact listener recognize
        // "the player landed on an enemy" (see ContactListener.CheckEnemyContact).
        public class HeadSensorUserData
        {
            public Enemy Enemy { get; private set; }

            public HeadSensorUserData(Enemy enemy)
            {
                Enemy = enemy;
            }
        }
    }
}
```

The "AI" here is deliberately simple — walk until a bound, turn around — and that's the point: enemy behavior is just **per-frame logic driving a physics body**, exactly like the player's movement in Part 3. Chasing, jumping, or line-of-sight behaviors are all upgrades to this one `Update` method.

## Step 3: Player Helpers

The player needs two small additions in `Player.cs` — a reusable respawn (extract the existing fall-off-screen reset), and a bounce for successful stomps:

```csharp
public void Update(float dt)
{
    // Update sprite position based on physics body
    Position = PhysicsHelper.ToCocosVector(_body.Position);

    // Check if player fell off the screen
    if (Position.Y < -100)
    {
        Respawn();
    }
}

public void Respawn()
{
    // Reset to the starting position
    _body.SetTransform(new b2Vec2(100 / PhysicsHelper.PTM_RATIO, 300 / PhysicsHelper.PTM_RATIO), 0);
    _body.LinearVelocity = b2Vec2.Zero;
}

public void Bounce()
{
    // A small hop, used after stomping an enemy
    _body.LinearVelocity = new b2Vec2(_body.LinearVelocity.x, JUMP_FORCE * 0.6f);
}
```

## Step 4: Teaching the Contact Listener About Enemies

This is where the design pays off. Add enemy checks to `BeginContact` in `ContactListener.cs`:

```csharp
// Check for enemy contacts (stomp or side hit)
CheckEnemyContact(contact.GetFixtureA(), contact.GetFixtureB());
CheckEnemyContact(contact.GetFixtureB(), contact.GetFixtureA());
```

And the handler:

```csharp
private void CheckEnemyContact(b2Fixture fixtureA, b2Fixture fixtureB)
{
    // Stomp: the player's FOOT sensor touched an enemy's HEAD sensor -
    // the two sensor patterns from Parts 3 and 6 meeting in the middle.
    Enemy.HeadSensorUserData headData = fixtureA.UserData as Enemy.HeadSensorUserData;
    Player.FootSensorUserData footData = fixtureB.UserData as Player.FootSensorUserData;

    if (headData != null && footData != null)
    {
        if (headData.Enemy.Parent is GameLayer stompLayer)
        {
            headData.Enemy.Defeat(stompLayer);
            footData.Player.Bounce();
        }
        return;
    }

    // Side hit: an enemy BODY fixture touched the player's BODY fixture.
    // The IsSensor check matters: without it, the player's foot sensor
    // brushing the enemy body would count as damage during a stomp.
    Enemy enemy = fixtureA.UserData as Enemy;
    if (enemy != null && !enemy.IsDefeated &&
        !fixtureB.IsSensor &&
        fixtureB.Filter.categoryBits == PhysicsHelper.CATEGORY_PLAYER)
    {
        if (enemy.Parent is GameLayer gameLayer)
        {
            gameLayer.OnPlayerHit();
        }
    }
}
```

:::tip The IsSensor guard

A stomp and a side hit can happen in the *same physics step* — the player's foot sensor overlaps the enemy's head sensor while the foot sensor also brushes the enemy's body box. The `!fixtureB.IsSensor` check ensures only the player's **solid body** fixture counts as taking a hit, so a clean stomp never punishes the player. Subtle contact-filtering details like this are where platformers live or die.

:::

## Step 5: Wiring Enemies Into the Level

In `GameLayer.cs`, track them, spawn them, and update them. Add the list next to the other game objects:

```csharp
private List<Enemy> _enemies = new List<Enemy>();
```

Spawn two at the end of `CreateLevel()` — one patrolling the floor, one holding a platform:

```csharp
// Create enemies: one patrolling the floor, one on a platform.
// Patrol bounds keep each enemy on its own ground.
Enemy floorEnemy = new Enemy(_world, 400, 110, 300, 550);
_enemies.Add(floorEnemy);
AddChild(floorEnemy);

Enemy platformEnemy = new Enemy(_world, 600, 160, 520, 680);
_enemies.Add(platformEnemy);
AddChild(platformEnemy);
```

Drive them from `Update`, right after the player:

```csharp
foreach (Enemy enemy in _enemies)
    enemy.Update(dt);
```

Handle the side hit, and clear the list on restart:

```csharp
public void OnPlayerHit()
{
    // Touching an enemy from the side sends the player back to the start.
    // Extension ideas: health/lives, invincibility frames, knockback.
    _player.Respawn();
}
```

```csharp
private void RestartGame(object sender)
{
    // Reset score
    _score = 0;

    _enemies.Clear();
    RemoveAllChildren();
    CreateLevel();
}
```

## 🎯 Checkpoint: Enemies

Run the game. You should see:
- Two red enemies patrolling — one on the floor, one on a platform — turning around at their bounds
- Landing on an enemy squashes it, plays a thump, awards **+25**, and bounces you
- Touching an enemy from the side sends you back to the start
- Restart brings the enemies back

Compare against the [Part 6 checkpoint](https://github.com/Cocos2D-Mono/cocos2d-mono-samples/tree/main/Tutorial%20Samples/Platformer/Checkpoints/Part%206) if anything differs.

## Troubleshooting

**The player passes through enemies** — check that the player's `maskBits` includes `CATEGORY_ENEMY` *and* the enemy's `maskBits` includes `CATEGORY_PLAYER`; filtering must agree from both sides.

**Stomping also respawns the player** — the `!fixtureB.IsSensor` guard is missing from the side-hit branch (see the tip in Step 4).

**Enemies walk off their platform** — patrol bounds are level-design data: keep `patrolMinX`/`patrolMaxX` inside the platform's horizontal extent. (Edge *detection* — turning around at a drop automatically — is a great extension exercise.)

**Enemies never move** — make sure `enemy.Update(dt)` is called from `GameLayer.Update` and that `bodyDef.allowSleep = false` is set.

## Complete Code Reference

The complete project through Part 6 is in the [tutorial samples repository](https://github.com/Cocos2D-Mono/cocos2d-mono-samples/tree/main/Tutorial%20Samples/Platformer/Final).

## Congratulations! 🎉

Your platformer now fights back. More importantly, you extended a real game *using only the patterns the game already taught you* — sensors, categories, user data, and per-frame logic. That's how features get added to shipping games too.

## Next Steps for Enhancement

Ideas for your next parts:
- Smarter AI: edge detection, chasing the player on sight, jumping enemies
- Health and lives instead of instant respawn
- Multiple levels with different layouts
- Power-ups and special abilities
- Better sprite artwork and animations
- Achievements and high scores
- Mobile touch controls

Thank you for following this tutorial series! You now have the foundation — and the patterns — to build complete 2D games with cocos2d-mono.
