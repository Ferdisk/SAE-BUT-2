
  new Chart(document.getElementById('nbStudentChart'), {
    type: 'bar',
    data: {
      labels: ['0-5', '6-10', '11-15', '16-20'],
      datasets: [{ //les données à mettre provenant de la base de données 
        label: "Nombre d'étudiants", 
        data: [1, 3, 9, 10], // juste ici
        backgroundColor: '#d32f2f'
      }]
    }
  });

new Chart(document.getElementById('completionRateChart'), {
    type: 'bar',
    data: {
        labels: ['Question 1', 'Question 2', 'Question 3'],
        datasets: [{ //première bar
            label: "Score moyen",
            data: [4, 8, 3],
            backgroundColor: '#4472C4'
        }, { //deuxième barre
            label: "Score maximum",
            data: [5, 10, 5],
            backgroundColor: '#C5C5C5'
        }]
    }
});