import { useState } from 'react'
import './App.css'

const playlists = [
  {
    id: 'midnight-drive',
    name: 'TVK',
    mood: 'Synth pop, late-night beats, city lights',
    color: '#2f80ed',
  },
  {
    id: 'sunny-side',
    name: 'DMK',
    mood: 'Indie pop, happy hooks, morning energy',
    color: '#f2994a',
  },
]

function PlaylistCard({ playlist, votes, onVote }) {
  return (
    <article className="playlist-card" style={{ borderColor: playlist.color }}>
      <div className="playlist-color" style={{ backgroundColor: playlist.color }}></div>
      <h2>{playlist.name}</h2>
      <p>{playlist.mood}</p>
      <strong>{votes} votes</strong>
      <button type="button" onClick={() => onVote(playlist.id)}>
        Vote for this
      </button>
    </article>
  )
}

function App() {
  const [votes, setVotes] = useState({
    'midnight-drive': 0,
    'sunny-side': 0,
  })

  function handleVote(playlistId) {
    setVotes({
      ...votes,
      [playlistId]: votes[playlistId] + 1,
    })
  }

  const firstPlaylist = playlists[0]
  const secondPlaylist = playlists[1]
  const firstVotes = votes[firstPlaylist.id]
  const secondVotes = votes[secondPlaylist.id]

  let leaderMessage = 'It is a tie. Choose your favorite playlist.'

  if (firstVotes > secondVotes) {
    leaderMessage = `${firstPlaylist.name} is leading.`
  } else if (secondVotes > firstVotes) {
    leaderMessage = `${secondPlaylist.name} is leading.`
  }

  return (
    <main className="app">
      <section className="intro">
        <p>Playlist Duel</p>
        <h1>Pick the playlist with the stronger vibe.</h1>
      </section>

      <section className="duel-grid">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            votes={votes[playlist.id]}
            onVote={handleVote}
          />
        ))}
      </section>

      <section className="leader-box">
        <p>Current leader</p>
        <h2>{leaderMessage}</h2>
      </section>
    </main>
  )
}

export default App
