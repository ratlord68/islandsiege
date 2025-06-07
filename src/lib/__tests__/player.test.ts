import { createPlayer } from "../player";

describe("createPlayer", () => {
  it("creates a player with default values", () => {
    const player = createPlayer("foo", 1);

    expect(player.id).toBe("p1");
    expect(player.name).toBe("foo");
    expect(player.coins).toBe(0);
    expect(player.hand).toEqual([]);
    expect(player.buildings).toEqual([]);
    expect(player.forts).toEqual([]);
    expect(player.ships).toEqual([]);
    expect(player.colonists).toBe(9);
    expect(player.cubes).toEqual({ black: 0, gray: 0, white: 0 });
    expect(player.attack_dice).toBe(2);
    expect(player.rerolls).toBe(1);
  });

  it("respects overrides", () => {
    const player = createPlayer("fizz", 3, { coins: 3, cubes: { black: 2 } });
    expect(player.id).toBe("p3");
    expect(player.coins).toBe(3);
    expect(player.cubes).toEqual({ black: 2, gray: 0, white: 0 });
  });
});
