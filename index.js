document.addEventListener('DOMContentLoaded', function () {
    // Author names functionality
    const authorContainer = document.querySelector('.authors-container');
    if (authorContainer) {
        authorContainer.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('author') || e.target.classList.contains('author1')) {
                document.querySelectorAll('.author-info').forEach(info => info.style.display = 'none');
                e.target.nextElementSibling.style.display = 'block';
            }
        });
        authorContainer.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('author') || e.target.classList.contains('author1')) {
                e.target.nextElementSibling.style.display = 'none';
            }
        });
    }

    // Tabs functionality
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Testimonials functionality
    const testimonialContainer = document.querySelector('.testimonial-container');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('testimonial')) {
                document.querySelectorAll('.testimonial').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    // Infinite carousel for placed students
    fetchAndPopulateCarousel();

    // Graphs functionality
    fetchAndCreateGraphs();
});

function fetchAndPopulateCarousel() {
    fetch('excelsheet/data.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.split(','));
            const advertisements = rows.filter(row => row.length >= 5)
                .map(row => createAdvertisement(row));

            const container = document.getElementById('advertisementContainer');
            if (container) {
                container.innerHTML = advertisements.join('').repeat(2);
                setupCarousel(container);
            }
        })
        .catch(error => console.error('Error fetching CSV file:', error));
}

function createAdvertisement(row) {
    const [imgSrc, name, dept, company, salary] = row.map(item => item.trim());
    return `
        <div class="advertisement">
            <img src="${imgSrc}" alt="${name}">
            <div class="name">${name}</div>
            <p>${dept}</p>
            <p>${company}</p>
            <p>${salary}</p>
        </div>
    `;
}

function setupCarousel(container) {
    let animationId;
    function moveCarousel() {
        if (container.scrollLeft >= container.scrollWidth / 2) {
            container.scrollLeft = 0;
        } else {
            container.scrollLeft += 1;
        }
        animationId = requestAnimationFrame(moveCarousel);
    }

    animationId = requestAnimationFrame(moveCarousel);

    container.addEventListener('mouseenter', () => cancelAnimationFrame(animationId));
    container.addEventListener('mouseleave', () => {
        animationId = requestAnimationFrame(moveCarousel);
    });
}

function fetchAndCreateGraphs() {
    fetch('excelsheet/company_branch.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
            // console.log(jsonData);
            

            [0, 1].forEach((columnIndex, index) => {
                const dataMap = countOccurrences(jsonData.slice(1), columnIndex);
                const chartData = prepareChartData(dataMap, index === 0);
                createChart(`myChart${index + 1}`, chartData, index === 0 ? 'Companies' : 'Branches');
            });
        })
        .catch(error => console.error('Error fetching Excel file:', error));
}

function countOccurrences(data, columnIndex) {
    return data.reduce((acc, row) => {
        const value = row[columnIndex];
        if (value) {
            const normalizedValue = value.toString().trim().toUpperCase();
            acc[normalizedValue] = (acc[normalizedValue] || 0) + 1;
        }
        return acc;
    }, {});
}

function prepareChartData(dataMap, limitToTop3) {
    let sortedData = Object.entries(dataMap).sort((a, b) => b[1] - a[1]);
    if (limitToTop3) {
        const topData = sortedData.slice(0, 3);
        const othersCount = sortedData.slice(3).reduce((sum, entry) => sum + entry[1], 0);
        sortedData = [...topData, ['Others', othersCount]].filter(entry => entry[1] > 0);
    }
    return {
        labels: sortedData.map(entry => entry[0]),
        dataValues: sortedData.map(entry => entry[1])
    };
}

function createChart(canvasId, chartData, title) {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    document.getElementById('chart-containers').appendChild(chartContainer);

    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    chartContainer.appendChild(canvas);

    new Chart(canvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: chartData.labels,
            datasets: [{
                data: chartData.dataValues,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#FF6384', '#36A2EB', '#FFCE56'],
                borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#FF6384', '#36A2EB', '#FFCE56'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: title },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: ${context.raw}`
                    }
                },
                datalabels: {
                    formatter: (value, context) => `${context.chart.data.labels[context.dataIndex]}: ${value}`,
                    color: '#000',
                    font: { weight: 'bold' }
                }
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
});


// Alumni testimonials
const alumniTestimonialItems = document.querySelector(".alumni-testimonial-items");
const alumniTestimonialPopup= document.querySelector(".alumni-testimonial-popup-box");
const popupCloseBtn = alumniTestimonialPopup.querySelector(".popup-close-btn");
const popupCloseIcon = alumniTestimonialPopup.querySelector(".popup-close-icon");
const alumniTestimonialRow = document.querySelector(".alumni-testimonial-row");

alumniDataFetchXlsx();
scrollerButtons();
alumniReadmorePopupDetails();

function alumniDataFetchXlsx(){
    fetch('excelsheet/alumniTestimonialData.xlsx') 
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.arrayBuffer();
    })
    .then(data => {
      const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
  
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
  
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      // console.log(jsonData);
      
      let content = "";
    jsonData.forEach((elem) => {
      content += `
       <div class="item">
          <div class="item-inner">
               <h3>${elem.NAME}</h3>
               <img src="photo/${elem.PHOTO}" alt="${elem.NAME}">
               <div class="alumni-name">${elem.NAME}</div>
               <p class="detail"><span>Branch: </span> ${elem.BRANCH} </p>
               <p class="detail"><span>Company: </span> ${elem.COMPANY}</p>
               <p class="detail"><span>CTC: </span> ${elem.CTC}</p>
               <div class="read-more-cont">
                <img src="photo/${elem.PHOTO}" alt="${elem.NAME}">
                <div class="alumni-name">${elem.NAME}</div>
                <p class="detail"><span>Branch: </span> ${elem.BRANCH}</p>
                <p class="detail"><span>Company: </span> ${elem.COMPANY}</p>
                <p class="detail"><span>CTC: </span> ${elem.CTC}</p>
                <p id="description">${elem.DESCRIPTION}</p>
                </div>
                <button class="btn" type="button">Read More</button>
                </div>
                </div>
                `;
    });
    alumniTestimonialRow.innerHTML += content;
  
    })
    .catch(error => {
      console.error('Error fetching or parsing the file:', error);
    });
}

function alumniReadmorePopupDetails() {

    alumniTestimonialItems.addEventListener("click", function (event) {
      if (event.target.tagName.toLowerCase() === "button") {
        const item = event.target.parentElement;

        const h3Element = item.querySelector("h3");
        const readMoreContElement = item.querySelector(".read-more-cont");

        if (h3Element && readMoreContElement) {
          const h3 = h3Element.innerHTML;
          const readMoreCont = readMoreContElement.innerHTML;

          const popupH3 = alumniTestimonialPopup.querySelector("h3");
          const popupBody = alumniTestimonialPopup.querySelector(".popup-body");

          if (popupH3 && popupBody) {
            popupH3.innerHTML = h3;
            popupBody.innerHTML = readMoreCont;
            popupBox();
          }
        }
      }
    });

    popupCloseIcon?.addEventListener("click", popupBox);
    popupCloseBtn?.addEventListener("click", popupBox);

    alumniTestimonialPopup.addEventListener("click", function (event) {
      if (event.target === alumniTestimonialPopup) {
        popupBox();
      }
    });

  function popupBox() {
    alumniTestimonialPopup.classList.toggle("open");
  }
}


function scrollerButtons(){
  let leftbtn = document.querySelector("#prev-scroll-btn")
  let rightbtn = document.querySelector("#next-scroll-btn")

  alumniTestimonialRow.addEventListener("wheel", (e) => {
    // e.preventDefault();
    alumniTestimonialRow.scrollLeft += e.deltaY;
  })
  
  rightbtn.addEventListener("click", ()=>{
    alumniTestimonialRow.style.scrollBehavior = "smooth";
    alumniTestimonialRow.scrollLeft += 350;
  })
  leftbtn.addEventListener("click", ()=>{
    alumniTestimonialRow.style.scrollBehavior = "smooth";
    alumniTestimonialRow.scrollLeft -= 350;
  })
}