import HillChart from '../src/index';
import { hillFn } from '../src/helpers';

let svg;
let config;
let data;

beforeEach(() => {
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  config = {
    target: svg,
    width: 900,
    height: 270,
    preview: false,
    margin: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 20,
    },
  };
  data = [
    {
      color: 'red',
      description: 'Late af task',
      size: 10,
      x: 12.069770990416055,
      y: 12.069770990416057,
      link: '/fired.html',
    },

    {
      color: 'yellow',
      description: 'Gettin there',
      size: 10,
      x: 55.11627906976744,
      y: 44.88372093023257,
    },
    {
      color: 'green',
      description: 'Hell yeah!',
      x: 93.48837209302326,
      y: 6.511627906976724,
      size: 10,
    },
  ];
});

function setupHillChart() {
  return new HillChart(data, config);
}

describe('hillchart@init', () => {
  it('normalizes data by plugging y on provided data to hillfn', () => {
    const hill = setupHillChart();
    hill.data.forEach((point, index) => {
      expect(point.y).toEqual(hillFn(data[index].y));
    });
  });

  it('normalizes data by providing default point size of 10', () => {
    data = data.map((d) => delete d.size);
    const hill = setupHillChart();
    hill.data.forEach((point) => {
      expect(point.size).toEqual(10);
    });
  });

  it('sets random id per point if is not provided', () => {
    const hill = setupHillChart();

    const pointIds = hill.data.map((point) => point.id);
    const isArrayUnique = (arr) =>
      Array.isArray(arr) && new Set(arr).size === arr.length;

    expect(isArrayUnique(pointIds)).toBe(true);
  });

  it('renders the svg and center the chart according to margins', () => {
    setupHillChart();
    expect(svg.getAttribute('height')).toEqual(config.height.toString());
    expect(svg.getAttribute('width')).toEqual(config.width.toString());
    expect(svg.querySelector('g').getAttribute('transform')).toEqual(
      `translate(${config.margin.left}, ${config.margin.top})`
    );
  });
});

describe('hillchart@render', () => {
  it('renders the horizontal bottom line on X axis with top margin of 5', () => {
    const hill = setupHillChart();
    hill.render();
    expect(
      svg
        .getElementsByClassName('hill-chart-bottom-line')[0]
        .getAttribute('transform')
    ).toEqual(`translate(0, ${hill.chartHeight + 5})`);
  });

  it('renders the main curve line', () => {
    const hill = setupHillChart();
    hill.render();

    expect(
      svg.getElementsByClassName('chart-hill-main-curve')[0]
    ).not.toBeNull();
  });

  it('renders the line in the middle correctly relative to the chart size', () => {
    const hill = setupHillChart();
    hill.render();
    const middleLine = svg.getElementsByClassName('hill-chart-middle-line')[0];
    expect(middleLine.getAttribute('x1')).toEqual(
      middleLine.getAttribute('x2')
    );
  });

  it('renders the footer text correctly', () => {
    const hill = setupHillChart();
    hill.render();

    expect(
      svg.getElementsByClassName('hill-chart-text')[0].innerHTML
    ).toContain('Figuring things out');
    expect(
      svg.getElementsByClassName('hill-chart-text')[1].innerHTML
    ).toContain('Making it happen');
  });
});
