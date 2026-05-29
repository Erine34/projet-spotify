fetch('data/data.json')
  .then(res => res.json())
  .then(data => {

    // ---- TOP 10 ARTISTES ----
    const artistes = {}
    data.forEach(track => {
      const nom = track.artists[0].name
      artistes[nom] = (artistes[nom] || 0) + 1
    })
    const top10 = Object.entries(artistes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    new Chart(document.getElementById('topArtistes'), {
      type: 'bar',
      data: {
        labels: top10.map(a => a[0]),
        datasets: [{
          label: 'Nombre de morceaux',
          data: top10.map(a => a[1]),
          backgroundColor: '#0d6efd'
        }]
      },
      options: { indexAxis: 'y' }
    })

    // ---- DISTRIBUTION GENRES ----
    const genres = {}
    data.forEach(track => {
      const g = track.artists[0].genres[0] || 'Autres'
      genres[g] = (genres[g] || 0) + 1
    })

    new Chart(document.getElementById('distGenres'), {
      type: 'pie',
      data: {
        labels: Object.keys(genres),
        datasets: [{ data: Object.values(genres) }]
      }
    })

  })


// ---- TABLEAU AVEC ALPINE ----
function tableauMusiques() {
  return {
    morceaux: [],
    recherche: '',

    init() {
      fetch('data/data.json')
        .then(res => res.json())
        .then(data => {
          this.morceaux = data
        })
    },

    morceauxFiltres() {
      const q = this.recherche.toLowerCase()
      return this.morceaux.filter(track =>
        track.name.toLowerCase().includes(q) ||
        track.artists[0].name.toLowerCase().includes(q) ||
        track.album.name.toLowerCase().includes(q)
      )
    }
  }
}

function albums() {
  return {
    albumsListe: [],

    init() {
      fetch('data/data.json')
        .then(res => res.json())
        .then(data => {
          const albumsMap = {}

          data.forEach(track => {
            const id = track.album.id
            if (!albumsMap[id]) {
              albumsMap[id] = {
                id: id,
                name: track.album.name,
                artist: track.artists[0].name,
                date: new Date(track.album.release_date).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric'
                }),
                image: track.album.images[0]?.url || '',
                titres: track.album.total_tracks,
                score: track.album.popularity
              }
            }
          })

          this.albumsListe = Object.values(albumsMap)
            .sort((a, b) => b.score - a.score)
            .slice(0, 12)
        })
    }
  }
}