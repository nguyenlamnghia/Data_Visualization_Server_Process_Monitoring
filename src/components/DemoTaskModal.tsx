import type { ProcessRun } from '../types';

interface DemoTaskModalProps {
  run: ProcessRun | null;
  onClose: () => void;
}

export function DemoTaskModal({ run, onClose }: DemoTaskModalProps) {
  if (!run) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Simulated server task"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Simulated server task</h2>
        <p>
          In the original dashboard this action links directly to the Tableau Server refresh task
          for <strong>{run.processName}</strong>.
        </p>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </section>
    </div>
  );
}
