
  new Chart(document.getElementById('nbStudentChart'), {
    type: 'bar',
    data: {
      labels: ['0-5', '6-10', '11-15', '16-20'],
      datasets: [{ //les données à mettre provenant de la base de données 
        label: "Nombre d'étudiants", 
        data: [1, 3, 9, 10], // juste ici
        backgroundColor: '#e2001a'
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
            backgroundColor: '#0082c8'
        }, { //deuxième barre
            label: "Score maximum",
            data: [5, 10, 5],
            backgroundColor: '#C5C5C5'
        }]
    }
});

//TODO fonction convertir le score obtenu /20 en %  
//fonction move qui prendra des valeur en paramèètre les valeur du score 
//  pour afficher le score en % (width)
var i = 0;
function move() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}