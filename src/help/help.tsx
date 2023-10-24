import './help.css';

export function Help(props: { close: () => void }) {
  const { close } = props;
  return (
    <div className="help" onClick={close}>
      <div onClick={(event) => event.stopPropagation()}>
        <div className="help-header">
          <h1>Hello and welcome!</h1>
          <button type="button" onClick={close} />
        </div>
        <p>
          <b style={{ color: '#CA2' }}>Golden Grid</b> is a <i>very</i> simple{' '}
          {'"'}programming{'"'} game where you can design NPCs for a resource
          gathering scenario simulation.
        </p>

        <p>
          I say {'"'}programming{'"'} like that because you won{"'"}t actually{' '}
          <b>code</b>, but rather design the agents{"'"} reasoning process using
          a{' '}
          <a href="#" target="_blank" rel="noopener">
            decision tree
          </a>{' '}
          (which is kinda like a flow chart), which means even non-programmers
          should be able to participate!
        </p>

        <h2>The game</h2>
        <p>
          This is a contest between two teams,{' '}
          <b style={{ color: '#ab212f' }}>Red</b> and{' '}
          <b style={{ color: '#212FAB' }}>Blue</b>, competing in a 2d grid for
          resources in the form of <b style={{ color: '#CA2' }}>gold</b> nuggets
          spread through the arena; their objective is simple: to pick up gold
          nuggets, carry them towards one of the color-coded rows (called{' '}
          <b>terminals</b>) and drop them off there for a point, moving and
          turning as needed.
        </p>

        <h2>Designing agents</h2>
        <p>
          If moving gold around is the goal of the game, yours is to design the
          reasoning process for the team members. All of them will have the same{' '}
          {'"'}brain{'"'}, that you{"'"}ll design by building the diagram in the
          editor page as a tree of questions, follow up questions and answers,
          and you{"'"}ll have access to information such as direction and the
          contents of nearby cells to do so (check out the — very simple —
          default agent for a reference tree). For each iteration, the game will
          run the decision tree for every agent, compute the results of their
          actions, and then run another iteration until the game is over.
        </p>

        <h2>Parameters</h2>
        <p>
          Back to the game arena: there{"'"}s a series of parameters that can be
          changed besides the agent template for the red/blue teams, such as
          initial agent placement in the arena and the amount (%) of agents. The
          two worth explaining here are the <b>max runs</b> and{' '}
          <b>max carries</b>: the first is the maximum amount of rounds in the
          game loop, working as an effective time limit with the FPS so that the
          game doesn{"'"}t run foverer in the case of a deadlock; the latter is
          the maximum amount of rounds that an agent can carry a gold nugget
          without dropping it, after which the nugget gets {'"'}taken away{'"'}{' '}
          and placed in a random cell in the arena (this is to avoid agents{' '}
          {'"'}hogging{'"'} gold indefinitely).
        </p>
      </div>
    </div>
  );
}
