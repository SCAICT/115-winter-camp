import { aiReason, topicReasons } from '../data/campGuide';

// 「為什麼非來不可」：讓家長在課程主題一開頭就看到這個營隊和一般課程的差別，並直接回答「有 AI 了為什麼還要學」。
export default function TopicReasons() {
  return (
    <div className="topic-reasons" data-reveal>
      <ul className="topic-reasons__list">
        {topicReasons.map(({ title, description }, index) => (
          <li key={title}>
            <span className="topic-reasons__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <strong>{title}</strong>
            <span className="topic-reasons__desc">{description}</span>
          </li>
        ))}
      </ul>

      <div className="topic-ai">
        <div className="topic-ai__head">
          <p className="topic-ai__question">{aiReason.question}</p>
          <p className="topic-ai__answer">{aiReason.answer}</p>
        </div>
        <ul className="topic-ai__points">
          {aiReason.points.map(({ title, description }) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
