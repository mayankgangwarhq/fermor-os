import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content into blocks (paragraphs, lists, headings, tables)
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = (key: string) => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={key} style={{ margin: '8px 0 12px 20px', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {currentList.items.map((item, idx) => (
            <li key={idx} style={{ lineHeight: 1.55 }}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={key} style={{ margin: '8px 0 12px 20px', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {currentList.items.map((item, idx) => (
            <li key={idx} style={{ lineHeight: 1.55 }}>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  const flushTable = (key: string) => {
    if (tableRows.length === 0) return;
    const headerRow = tableRows[0];
    const bodyRows = tableRows.slice(1).filter(r => !r.every(c => c.trim().match(/^:?-+:?$/)));

    elements.push(
      <div key={key} style={{ overflowX: 'auto', margin: '12px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', border: '1px solid #e2e8f0' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              {headerRow.map((h, i) => (
                <th key={i} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', fontWeight: 700, textAlign: 'left' }}>
                  {renderInline(h.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} style={{ backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} style={{ padding: '8px 12px', border: '1px solid #e2e8f0' }}>
                    {renderInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Table line: | col1 | col2 |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList(`list-before-table-${index}`);
      inTable = true;
      const cols = trimmed.slice(1, -1).split('|');
      tableRows.push(cols);
      return;
    } else if (inTable) {
      flushTable(`table-${index}`);
    }

    // Heading 1 (# Heading)
    if (trimmed.startsWith('# ')) {
      flushList(`list-${index}`);
      elements.push(
        <h1
          key={`h1-${index}`}
          style={{ fontSize: '1.28rem', fontWeight: 800, color: '#0f172a', margin: '14px 0 8px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}
        >
          {renderInline(trimmed.substring(2))}
        </h1>
      );
      return;
    }

    // Heading 2 (## Heading)
    if (trimmed.startsWith('## ')) {
      flushList(`list-${index}`);
      elements.push(
        <h2
          key={`h2-${index}`}
          style={{ fontSize: '1.15rem', fontWeight: 800, color: '#14532D', margin: '14px 0 6px 0' }}
        >
          {renderInline(trimmed.substring(3))}
        </h2>
      );
      return;
    }

    // Heading 3 (### Heading)
    if (trimmed.startsWith('### ')) {
      flushList(`list-${index}`);
      elements.push(
        <h3
          key={`h3-${index}`}
          style={{ fontSize: '1.02rem', fontWeight: 800, color: '#166534', margin: '12px 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {renderInline(trimmed.substring(4))}
        </h3>
      );
      return;
    }

    // Blockquote (> text)
    if (trimmed.startsWith('> ')) {
      flushList(`list-${index}`);
      elements.push(
        <div
          key={`bq-${index}`}
          style={{
            borderLeft: '3.5px solid #16A34A',
            backgroundColor: '#F0FDF4',
            padding: '8px 12px',
            borderRadius: '0 8px 8px 0',
            margin: '8px 0',
            fontSize: '0.88rem',
            color: '#166534',
          }}
        >
          {renderInline(trimmed.substring(2))}
        </div>
      );
      return;
    }

    // Bullet List (* item or - item)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const itemText = trimmed.substring(2);
      if (!currentList || currentList.type !== 'ul') {
        flushList(`list-prev-${index}`);
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Numbered List (1. item)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      const itemText = numMatch[2];
      if (!currentList || currentList.type !== 'ol') {
        flushList(`list-prev-${index}`);
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Normal line / Empty line
    if (!trimmed) {
      flushList(`list-empty-${index}`);
      return;
    }

    // Regular paragraph
    flushList(`list-p-${index}`);
    elements.push(
      <p key={`p-${index}`} style={{ margin: '6px 0', lineHeight: 1.6, fontSize: '0.93rem', color: '#1e293b' }}>
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList('list-end');
  if (inTable) flushTable('table-end');

  return <div className={`markdown-content ${className}`}>{elements}</div>;
};

/**
 * Parses inline formatting: bold, italic, inline code, links
 */
function renderInline(text: string): React.ReactNode {
  if (!text) return '';

  // Tokenize string for **bold**, *italic*, `code`, and [link](url)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} style={{ fontWeight: 700, color: '#0f172a' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={i} style={{ fontStyle: 'italic', color: '#334155' }}>
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={i}
          style={{
            backgroundColor: '#f1f5f9',
            color: '#0f766e',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.84rem',
            fontFamily: 'monospace',
            border: '1px solid #e2e8f0',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Link: [title](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const linkTitle = linkMatch[1];
      const linkUrl = linkMatch[2];
      return (
        <a
          key={i}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#15803d',
            textDecoration: 'underline',
            fontWeight: 700,
          }}
        >
          {linkTitle} ↗
        </a>
      );
    }

    return part;
  });
}
