# FoodScript

Simple TypeScript programming/simulation game.

Here's a deployed version (with only a couple of basic agents, see section below on how to build custom ones): https://rad-blini-ed8b9a.netlify.app/

## Running

This is a basic Vite project, so after installing the dependencies (the project uses pnpm by default, but any other package manager should work fine), just run:

```bash
pnpm dev
```

And the dev server should then be running on `http://localhost:5173`, where you can run a few games and familiarize yourself with some of the parameters.

## Writing custom agents

The basic repo only has two very simple agents, to make others available just export new ones from the same `agents.ts` file, after which they should then be automatically available to select in the dropdowns.

```typescript
export const myAgent: AgentFunction = (perception, state) => {
   ...
};
```

It should be a basic model-based reflex agent: it takes a (limited) perception of the current environment (what's in the cells around it, direction, etc.; check out the `reasoning.ts` file for the full object) and returns an action (based on the perception and the - optional - internal state). TypeScript should help here with the possible actions.

## Basic rules

There's two teams, **Red** and **Blue**, competing in a grid for resources in the form of gold nuggets spread through the arena; the objective is simple: to pick up nuggets, carry them towards one of the color-coded rows (called **terminals**) and drop them off, moving and turning as needed. Dropping gold in the terminal gives the team a point, and the agent is free to roam to search for other nuggets. The game ends after the remaining amount of nuggets is less than the difference between the team scores.

## Parameters

There's a series of parameters that can be changed besides the red/blue team agents, such as initial agent placement in the arena and the amount (%) of agents. The two worth explaining here are the **max runs** and **max carries**: the first is the maximum amount of rounds in the game loop, working as an effective time limit with the FPS so that the game doesn't run foverer in case of a deadlock; the latter is the maximum amount of rounds that an agent can carry a gold nugget without dropping it, after which the nugget gets "taken away" and placed in a random cell in the arena (this is to avoid agents "hogging" gold indefinitely).
