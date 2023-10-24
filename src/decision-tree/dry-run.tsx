import { useCallback } from 'react';

import { decide } from '../simulation/processors/reasoning';
import type { Perception } from '../types';
import type { Graph } from './graph';
import { randId } from './utils';

function Select(props: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  const { name, label, options, defaultValue } = props;
  return (
    <label htmlFor={name}>
      <div>{label}</div>
      <select id={name} name={name} defaultValue={defaultValue}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const booleanOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

const directionOptions = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
];

const cellOptions = [
  { value: 'wall', label: 'Wall' },
  { value: 'gold', label: 'Gold' },
  { value: '', label: 'Free' },
  { value: 'friend', label: 'Friend' },
  { value: 'foe', label: 'Foe' },
];

export function DryRun(props: { graph: Graph; collapse: () => void }) {
  const { graph, collapse } = props;
  const onRun = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const form = new FormData(event.currentTarget);
      const parse = (field: string) => {
        const value = form.get(field) as string;
        try {
          return JSON.parse(value);
        } catch (error) {
          return value || null;
        }
      };

      const perception = {
        id: randId(),
        isCarrying: parse('isCarrying'),
        isInTerminal: parse('isInTerminal'),
        isFacingTerminal: parse('isFacingTerminal'),
        direction: parse('direction'),
        center: parse('center'),
        ahead: parse('ahead'),
        centerLeft: parse('centerLeft'),
        left: parse('left'),
        centerRight: parse('centerRight'),
        right: parse('right'),
      } as unknown as Perception;

      graph.setHighlight(decide(perception, graph.nodes).path);
    },
    [graph],
  );

  const onCollapse = useCallback(() => {
    collapse();
    graph.setHighlight([]);
  }, [collapse, graph]);

  return (
    <div className="dry-run">
      <form onSubmit={onRun}>
        <div className="row">
          <Select
            name="isCarrying"
            label="Is carrying?"
            options={booleanOptions}
            defaultValue="true"
          />
          <Select
            name="direction"
            label="Direction"
            options={directionOptions}
            defaultValue="true"
          />
        </div>
        <div className="row">
          <Select
            name="isInTerminal"
            label="Is in terminal?"
            options={booleanOptions}
            defaultValue="false"
          />
          <Select
            name="isFacingTerminal"
            label="Is facing terminal?"
            options={booleanOptions}
            defaultValue="false"
          />
        </div>

        <div className="row">
          <Select
            name="center"
            label="Center"
            options={cellOptions}
            defaultValue=""
          />
          <Select
            name="ahead"
            label="Ahead"
            options={cellOptions}
            defaultValue="gold"
          />
        </div>
        <div className="row">
          <Select
            name="centerLeft"
            label="Center left"
            options={cellOptions}
            defaultValue="friend"
          />
          <Select
            name="left"
            label="Left"
            options={cellOptions}
            defaultValue="foe"
          />
        </div>
        <div className="row">
          <Select
            name="centerRight"
            label="Center right"
            options={cellOptions}
            defaultValue="free"
          />
          <Select
            name="right"
            label="Right"
            options={cellOptions}
            defaultValue="gold"
          />
        </div>

        <div className="row">
          <button type="submit">Test</button>
          <button type="button" onClick={onCollapse}>
            Collapse
          </button>
        </div>
      </form>
    </div>
  );
}
