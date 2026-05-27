export function createSlider(container, options) {
  const {
    start = 50,
    min = 0,
    max = 100,
    step = 1,
    onChange = () => {},
  } = options;

  let isInternalSet = false;

  noUiSlider.create(container, {
    start,
    range: {
      min,
      max,
    },
    step,
    connect: [true, false],
    behaviour: 'tap-drag',
    format: {
      to: (value) => Math.round(value),
      from: (value) => Number(value),
    },
  });

  function emit(values) {
    if (isInternalSet) {
      return;
    }

    onChange(Number(values[0]));
  }

  container.noUiSlider.on('slide', emit);
  container.noUiSlider.on('change', emit);

  container.noUiSlider.on('set', (values) => {
    if (isInternalSet) {
      return;
    }

    onChange(Number(values[0]));
  });

  return {
    set: (value) => {
      isInternalSet = true;
      container.noUiSlider.set(value);
      isInternalSet = false;
    },
    get: () => Number(container.noUiSlider.get()),
    destroy: () => {
      container.noUiSlider.destroy();
    },
  };
}
