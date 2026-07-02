import './FloatingNotes.css'

// Musical note characters to float around the logo
const NOTES = ['♩', '♪', '♫', '♬']

// Generate 12 notes with randomized properties
const notes = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  symbol: NOTES[i % NOTES.length],
  left: `${10 + (i * 7) % 80}%`,
  animationDuration: `${2.5 + (i * 0.4) % 2.5}s`,
  animationDelay: `${(i * 0.3) % 2.5}s`,
  fontSize: `${12 + (i * 3) % 14}px`,
  opacity: 0.4 + (i * 0.05) % 0.4,
}))

function FloatingNotes() {
  return (
    <div className="floating-notes-container">
      {notes.map(note => (
        <span
          key={note.id}
          className="floating-note"
          style={{
            left: note.left,
            animationDuration: note.animationDuration,
            animationDelay: note.animationDelay,
            fontSize: note.fontSize,
            opacity: note.opacity,
          }}
        >
          {note.symbol}
        </span>
      ))}
    </div>
  )
}

export default FloatingNotes