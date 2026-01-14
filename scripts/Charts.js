new Chart(document.getElementById('nbStudentChart'), {
    type: 'bar',
    data: {
      labels: ['0-5', '6-10', '11-15', '16-20'],
      datasets: [{ 
        label: "Nombre d'étudiants", 
        data: [1, 3, 9, 10], 
        backgroundColor: '#e2001a'
      }]
    }
  });

new Chart(document.getElementById('completionRateChart'), {
    type: 'bar',
    data: {
        labels: ['Question 1', 'Question 2', 'Question 3'],
        datasets: [{ 
            label: "Score moyen",
            data: [4, 8, 3],
            backgroundColor: '#0082c8'
        }, { 
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
function move_first_bar() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar1");
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

var j = 0;
function move_second_bar() {
  if (j == 0) {
    j = 1;
    var elem = document.getElementById("myBar2");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        j = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}
var k = 0;
function move_third_bar() {
  if (k == 0) {
    k = 1;
    var elem = document.getElementById("myBar3");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        k = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}