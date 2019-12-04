window.onload = () => {
  let user = null
  let matches = []
  let dogs = []
  let updateDogCard = (dog) => {
    let dogCard = document.querySelector('.dog-card')
    if (dogCard && dog) {
      dogCard.style.backgroundImage = `url(${dog.picture})`
      dogCard.innerHTML = ''
      const div = document.createElement('div')
      div.classList.add('mt-auto', 'text-white', 'p-3')
      const h2 = document.createElement('h2')
      h2.innerText = dog.name
      div.appendChild(h2)
      const p = document.createElement('p')
      p.innerText = dog.description
      div.appendChild(p)
      dogCard.appendChild(div)
    } else {
      dogCard.style.backgroundImage = null
      dogCard.innerHTML = ''
      const div = document.createElement('div')
      div.classList.add('mt-auto', 'p-3')
      const h3 = document.createElement('h3')
      h3.innerText = 'No dogs in your area.'
      div.appendChild(h3)
      const p = document.createElement('p')
      p.innerText = 'Please check back later'
      div.appendChild(p)
      dogCard.appendChild(div)
    }
  }
  let updateMatchesList = (matches) => {
    let matchesContainer = document.querySelector('.matches-container')
    if (matchesContainer) {
      matchesContainer.innerHTML = ''
      const h3 = document.createElement('h3')
      h3.innerText = 'Matches'
      matchesContainer.appendChild(h3)
      matches.forEach(match => {
        const a = document.createElement('a')
        a.href = `dogs/${match._id}`
        const profileContainer = document.createElement('div')
        profileContainer.classList.add('profile-container', 'text-dark', 'py-3')
        const profileImage = document.createElement('div')
        profileImage.classList.add('img-profile', 'float-left', 'rounded-circle')
        profileImage.style.backgroundImage = `url(${match.picture})`
        const div = document.createElement('div')
        div.classList.add('px-2', 'float-left')
        const h4 = document.createElement('h4')
        h4.innerText = match.name
        div.appendChild(h4)
        const p = document.createElement('p')
        p.innerText = match.description
        div.appendChild(p)
        profileContainer.appendChild(profileImage)
        profileContainer.appendChild(div)
        a.appendChild(profileContainer)
        matchesContainer.appendChild(a)
      });
    }
  }
  // Get all matches
  fetch("/api/v1/matches").then(res => {
    return res.json();
  }).then((data) => {
    matches = data
  })
  
  // Get new dogs
  fetch("/api/v1/dogs").then(res => {
    return res.json();
  }).then((data) => {
    dogs = data
    updateDogCard(dogs[0])
  })
  
  // Dislike dog
  const dislikeButton = document.getElementById('dislike')
  if (dislikeButton) {
    dislikeButton.addEventListener('click', (event) => {
      if (dogs.length > 0) {
        let dog = dogs.shift()
        fetch(`/api/v1/dogs/${dog._id}/dislike`, {
          method: "POST",
        }).then(res => {
          updateDogCard(dogs[0])
        })
      }
    })
  }

  // Like dog
  const likeButton = document.getElementById('like')
  if (likeButton) {
    likeButton.addEventListener('click', (event) => {
      if (dogs.length > 0) {
        let dog = dogs.shift()
        fetch(`/api/v1/dogs/${dog._id}/like`, {
          method: "POST",
        }).then(res => {
          if(res.ok) {
            updateDogCard(dogs[0])
            matches.push(dog)
            updateMatchesList(matches)
          }
        })
      }
    })
  }

}
