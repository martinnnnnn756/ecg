// Firebase 설정
var firebaseConfig = {
            apiKey: "AIzaSyA8CM-GWJIsdDn07fS-00tGh1Hhwh_Y4dY",
            authDomain: "ecg-data-24d99.firebaseapp.com",
            databaseURL: "https://ecg-data-24d99-default-rtdb.firebaseio.com",
            projectId: "ecg-data-24d99",
            storageBucket: "ecg-data-24d99.appspot.com",
            messagingSenderId: "1035566325050",
            appId: "1:1035566325050:web:4d58ac88d60e9f413f4403"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Chart.js 설정
var ctx = document.getElementById('ecgChart').getContext('2d');
var ecgChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // 시간 데이터
        datasets: [{
            label: 'ECG 데이터',
            data: [], // ECG 값
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    tooltipFormat: 'HH:mm:ss'
                },
                title: {
                    display: true,
                    text: '시간'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'ECG 값'
                }
            }
        }
    }
});

// 차트를 업데이트하는 함수
function updateChart(snapshot) {
    var data = snapshot.val();
    if (data) {
        var timestamp = data.timestamp;
        var value = data.value;
        
        // 새로운 데이터를 차트에 추가
        ecgChart.data.labels.push(timestamp);
        ecgChart.data.datasets[0].data.push(value);
        
        // 일정 개수의 데이터만 유지
        if (ecgChart.data.labels.length > 50) {
            ecgChart.data.labels.shift();
            ecgChart.data.datasets[0].data.shift();
        }

        ecgChart.update();
    }
}

// 새로운 ECG 데이터 리스닝
database.ref('/ecgData').on('child_added', updateChart);
