// Lire le data.json
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    // Top 10 Artistes
    const artistes = {}
    data.forEach(track => {
      artistes[track.artist] = (artistes[track.artist] || 0) + 1
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

    // Distribution Genres
    const genres = {}
    data.forEach(track => {
      genres[track.genre] = (genres[track.genre] || 0) + 1
    })

    new Chart(document.getElementById('distGenres'), {
      type: 'pie',
      data: {
        labels: Object.keys(genres),
        datasets: [{
          data: Object.values(genres),
        }]
      }
    })
  })