import { ReactNode } from 'react';

interface FocusRegionProps {
  /**
   * Unique identifier following the pattern:
   * - Depth 0: "section-name"
   * - Depth 1: "section__block"
   * - Depth 2: "section__block__element"
   * - Depth 3: "section__block__element__detail"
   */
  id: string;

  /**
   * Human-readable label describing what this region contains.
   * This appears in the focus manifest and helps AI understand context.
   * Should be in German for Swiss content.
   */
  label: string;

  /**
   * The content to wrap.
   */
  children: ReactNode;

  /**
   * Additional CSS classes. The component automatically adds `scroll-mt-24`.
   */
  className?: string;

  /**
   * Semantic HTML element to render. Defaults to 'div'.
   * Use 'section' for depth-0 regions, 'article' for standalone content, etc.
   */
  as?: keyof JSX.IntrinsicElements;
}

export function FocusRegion({
  id,
  label,
  children,
  className = '',
  as: Component = 'div'
}: FocusRegionProps) {
  // Infer depth from ID pattern (count of "__" separators)
  const depth = (id.match(/__/g) || []).length;

  return (
    <Component
      id={id}
      data-focus-label={label}
      data-focus-depth={depth}
      className={`scroll-mt-24 ${className}`}
    >
      {children}
    </Component>
  );
}
