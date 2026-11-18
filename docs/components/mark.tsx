/** badil's mark, as on the landing (src/App.tsx): production (the solid panel) and its double, the preview
 * (the dashed twin in front). The knockout takes the ground's colour. */
export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 414 444" aria-hidden="true" focusable="false">
      <path
        className="mark__prod"
        d="M8.00 173.83 Q8.00 133.83 44.49 117.44L251.51 24.40 Q288.00 8.00 288.00 48.00L288.00 198.00 Q288.00 238.00 251.51 254.40L44.49 347.44 Q8.00 363.83 8.00 323.83Z"
      />
      <path
        className="mark__knock"
        d="M126.00 245.83 Q126.00 205.83 162.49 189.44L369.51 96.40 Q406.00 80.00 406.00 120.00L406.00 270.00 Q406.00 310.00 369.51 326.40L162.49 419.44 Q126.00 435.83 126.00 395.83Z"
      />
      <path
        className="mark__twin"
        d="M126.00 245.83 Q126.00 205.83 162.49 189.44L369.51 96.40 Q406.00 80.00 406.00 120.00L406.00 270.00 Q406.00 310.00 369.51 326.40L162.49 419.44 Q126.00 435.83 126.00 395.83Z"
      />
    </svg>
  );
}
