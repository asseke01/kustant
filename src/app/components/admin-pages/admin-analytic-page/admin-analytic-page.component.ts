import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ReactiveFormsModule} from "@angular/forms";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  Tooltip,
  Legend, ChartData, ChartOptions, DoughnutController, ArcElement, TooltipItem,
} from 'chart.js';
import {NgClass, NgIf} from '@angular/common';
import {AnalyticService} from '../../../services/analytic-services/analytic.service';
import {LoaderService} from '../../../services/helper-services/loader.service';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement
);
@Component({
  selector: 'app-admin-analytic-page',
  standalone: true,
  imports: [
    BaseChartDirective,
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './admin-analytic-page.component.html',
  styleUrl: './admin-analytic-page.component.css'
})
export class AdminAnalyticPageComponent implements OnInit{
  private analyticService = inject(AnalyticService);
  public loaderService = inject(LoaderService);

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  viewDetail:boolean=true;
  dashboard :any = {};
  type:string = 'year';
  rawData :any = {};

  lineChartData = {
    labels: ['Loading...'],
    datasets: [
      {
        label: 'Кол.во Учеников',
        data: [0],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };


  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#000000',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 5,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
          color: '#888888',
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          font: {
            size: 14,
          },
          color: '#888888',
        },
      },
    },
  };



  barChartData: ChartData<'bar'> = {
    labels: ['Ziyatker', '140Online', 'Bolashaq', '125High', 'Maximum', 'Ziyatker'],
    datasets: [
      {
        label: 'Учащиеся',
        data: [110, 130, 120, 125, 135, 110],
        backgroundColor: 'rgba(0, 123, 255, 0.7)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  chartData: any = {}
  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem: TooltipItem<'doughnut'>) => {
            const value = tooltipItem.raw;
            const label = tooltipItem.label;
            return `Кол. учеников: ${value}`;
          },
        },
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 5,
        padding: 10,
      },
    },
  };




  ngOnInit() {
    this.loadDashboard();
    this.loadYears(this.type);
    this.loadChartData();
  }



  loadChartData(): void {
    this.analyticService.getLoadInfo().subscribe(
      (data: any) => {
        if (data.entrings_diagram) {
          const diagramData = data.entrings_diagram;

          this.chartData = {
            labels: ['Слабо (0 раз)', 'Умеренно (1-3 раза в неделю)', 'Интенсивно (+3 раза)'],
            datasets: [
              {
                data: [diagramData['0'], diagramData['1-3'], diagramData['+3']],
                backgroundColor: ['#7EA6FF', '#D4E4FF', '#002F91'],
                borderWidth: 0,
                borderRadius: 21,
              },
            ],
          };

        }

  })
  }





  loadDashboard(){
    this.analyticService.getDashboard().subscribe(data=>{
      this.dashboard = data;
    })
  }

  onTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.loaderService.show();

    this.loadYears(selectedValue);
  }


  loadYears(type: string) {
    this.type = type;

    this.analyticService.getAnalytics(this.type).subscribe(
      (data: any) => {
        this.rawData = data;

        const labels = Object.keys(this.rawData);
        const values = Object.values(this.rawData);

        this.lineChartData.labels = labels;
        this.lineChartData.datasets[0].data = values as number[];

        if (this.chart) {
          this.chart.update();
        }

        this.loaderService.hide();
      },
      (error) => {
        console.error('Ошибка при загрузке данных:', error);

        this.loaderService.hide();
      }
    );
  }

  changeView(view: boolean): void {
    this.viewDetail = view;
  }

}

