import { registrationSteps } from '../data/campGuide';
import { winterCamp } from '../data/winterCamp';

export default function RegistrationFlow() {
  const { ticket } = winterCamp;

  return (
    <section id="registration" className="registration-flow rates" aria-labelledby="registration-flow-title">
      <h3 id="registration-flow-title" data-reveal>報名流程</h3>
      <ol className="registration-flow__steps">
        {registrationSteps.map((step, index) => <li key={step.title} data-reveal style={{ '--reveal-delay': `${index * 70}ms` }}><span className="registration-flow__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h4>{step.title}</h4><p>{step.description}</p></li>)}
      </ol>
    </section>
  );
}
