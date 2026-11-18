import { CSSProperties, Fragment } from 'react';

interface SplitTextProps {
  text: string;
  by: 'char' | 'word';
  className?: string;
  // Numbering continues across several SplitTexts, e.g. two lines of one headline
  startIndex?: number;
  pieceStyle?: (index: number) => CSSProperties | undefined;
}

// Splits text into spans that a section can animate one by one. The spans are hidden from
// screen readers, so the parent must also render the full text in a .visually-hidden span.
const SplitText = ({ text, by, className, startIndex = 0, pieceStyle }: SplitTextProps) => {
  const pieces = by === 'char' ? [...text] : text.split(' ');

  return (
    <span aria-hidden="true">
      {pieces.map((piece, i) => {
        const index = startIndex + i;
        return (
          <Fragment key={index}>
            {by === 'word' && i > 0 && ' '}
            <span className={className} style={pieceStyle?.(index)} data-piece={index}>
              {piece}
            </span>
          </Fragment>
        );
      })}
    </span>
  );
};

export default SplitText;
