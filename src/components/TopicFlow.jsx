import { topicFlow } from '../data/campGuide';

// 營隊五個學習階段（Develop → Compete）。首頁只顯示名稱；detailed 時（/topics/）另顯示每個階段的說明。
export default function TopicFlow({ detailed = false }) {
  return (
    <ol className={`topics-flow${detailed ? ' topics-flow--detailed' : ''}`} aria-label="營隊五個學習階段" data-reveal>
      {topicFlow.map(({ key, title, description }, index) => (
        <li key={key}>
          <span className="topics-flow__number" aria-hidden="true">{index + 1}</span>
          <span className="topics-flow__label">
            <strong>{title}</strong>
            <small lang="en">{key}</small>
            {detailed && <span className="topics-flow__desc">{description}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
