import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

    public doughnutCharts: any;
    public barChart: any;

    constructor() {
        this.doughnutCharts = [
            {
                labels: ['Đúng giờ', 'Muộn giờ'],
                datasets: [
                    {
                        data: [60, 5],
                        backgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ],
                        hoverBackgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ]
                    }
                ],
                title: 'Biểu đồ tỉ lệ đi học muộn lớp 1a'
            },
            {
                labels: ['Đúng giờ', 'Muộn giờ'],
                datasets: [
                    {
                        data: [30, 35],
                        backgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ],
                        hoverBackgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ]
                    }
                ],
                title: 'Biểu đồ tỉ lệ đi học muộn lớp 1b'
            },
            {
                labels: ['Đúng giờ', 'Muộn giờ'],
                datasets: [
                    {
                        data: [20, 45],
                        backgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ],
                        hoverBackgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ]
                    }
                ],
                title: 'Biểu đồ tỉ lệ đi học muộn lớp 2a'
            },
            {
                labels: ['Đúng giờ', 'Muộn giờ'],
                datasets: [
                    {
                        data: [10, 50],
                        backgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ],
                        hoverBackgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ]
                    }
                ],
                title: 'Biểu đồ tỉ lệ đi học muộn lớp 2b'
            },
            {
                labels: ['Đúng giờ', 'Muộn giờ'],
                datasets: [
                    {
                        data: [40, 25],
                        backgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ],
                        hoverBackgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ]
                    }
                ],
                title: 'Biểu đồ tỉ lệ đi học muộn lớp 3a'
            },
            {
                labels: ['Đúng giờ', 'Muộn giờ'],
                datasets: [
                    {
                        data: [50, 25],
                        backgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ],
                        hoverBackgroundColor: [
                            '#36A2EB',
                            '#FF6384'
                        ]
                    }
                ],
                title: 'Biểu đồ tỉ lệ đi học muộn lớp 3b'
            }

        ];

        this.barChart = {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            datasets: [
                {
                    label: 'Doanh thu',
                    backgroundColor: '#42A5F5',
                    borderColor: '#1E88E5',
                    data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56]
                },
                {
                    label: 'Khoản chi',
                    backgroundColor: '#9CCC65',
                    borderColor: '#7CB342',
                    data: [28, 48, 40, 19, 26, 27, 20, 28, 48, 40, 19, 18]
                }
            ]
        }
    }

    ngOnInit() {
    }

}
