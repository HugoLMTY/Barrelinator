// How many mm for a pixel
let ratio = 2

// Units/Els to display
const units = [
  {
    unit: 'mm',
    name: 'Millimètres'
  },
  {
    unit: 'in',
    name: 'Pouces'
  } 
]

const els = [
  {
    id: 'handguard',
    name: 'Garde main',
    classes: ['col']
  },
  {
    id: 'suppressor',
    name: 'Silencieux',
    classes: ['col']
  },
  {
    id: 'innerbarrel',
    name: 'Canon',
    classes: ['col-12']
  },
]
const headers = [
  {
    name: 'Unité',
    id: 'unit'
  },
  ...els,
  {
    name: 'Total externe',
    id: 'total'
  },
  {
    name: 'Différence',
    id: 'diff'
  },
]

let default_ratio = 2
let default_dimensions = {
  handguard: 254,
  suppressor: 145,
  innerbarrel: 363
}

// All stored in mm
let dimensions = {
  ...default_dimensions
}

const getDimension = (type, unit) => unit === 'mm' ? Math.round(dimensions[type]) : Math.round(dimensions[type] / 25.40)
const setDimension = (type, value, unit) => dimensions[type] = unit === 'mm' ? value : value * 25.40

const drawBarrels = () => {
  const parent = document.querySelector(`#simulation-container`)
  // parent.innerHTML = ''
  parent.style.marginLeft = '50px'
  parent.style.marginBottom = '20px'
  els.forEach(({ id, name }) => {

    const el = document.createElement('div')
    el.id = `${id}_div`
    el.innerHTML = name

    el.title = `${name}: ${getDimension(id, 'mm')}mm (${getDimension(id, 'in')}in)`
    el.style.cursor = 'pointer'

    el.style.textAlign = 'center'
    el.style.fontSize = '14px'
    el.style.color = 'white'
    el.style.overflow = 'hidden'

    el.style.width = `${getDimension(id, 'mm') * ratio}px`
    el.style.height = '20px'

    el.style.background = 'black'
    el.style.borderRadius = '10px'

    if (id !== 'innerbarrel') {
      el.style.display = 'inline-block'
    }

    // parent.appendChild(el)
    if (parent.querySelector(`#${id}_div`)) {
      parent.querySelector(`#${id}_div`).replaceWith(el)
    } else {
      parent.appendChild(el)
    }
  })
}

const drawForms = (currentUnit = null) => {
  const parent = document.querySelector(`#forms-container`)
  parent.style.marginBottom = '20px'

  units.forEach(({ name, unit }) => {
    if (currentUnit === unit) return

    const accordion = document.createElement('div')
    accordion.classList.add('accordion')
    accordion.id = `${unit}_accordion`

    const item = document.createElement('div')
    item.classList.add('accordion-item')
    item.id = `${unit}_item`

    const header = document.createElement('h2')
    header.classList.add('accordion-header')
    header.id = `${unit}_header`

    const button = document.createElement('button')
    button.classList.add('accordion-button')
    button.type = 'button'
    button.setAttribute('data-bs-toggle', 'collapse')
    button.setAttribute('data-bs-target', `#${unit}_collapse`)
    button.setAttribute('aria-expanded', 'true')
    button.setAttribute('aria-controls', `${unit}_collapse`)
    button.innerHTML = name

    header.appendChild(button)

    const collapse = document.createElement('div')
    collapse.classList.add('accordion-collapse', 'collapse', 'show')
    collapse.id = `${unit}_collapse`
    collapse.setAttribute('aria-labelledby', `${unit}_header`)
    collapse.setAttribute('data-bs-parent', `#${unit}_accordion`)

    const unit_title = document.createElement('h4')
    unit_title.classList.add('mx-3', 'mt-3')
    unit_title.innerHTML = name

    const total = document.createElement('h6')
    total.classList.add('mx-5')
    total.innerHTML = `Total externe: ${getDimension('handguard', unit) + getDimension('suppressor', unit)}/${getDimension('innerbarrel', unit)}${unit} <br> Différence: ${getDimension('innerbarrel', unit) - (getDimension('handguard', unit) + getDimension('suppressor', unit))} ${unit}`
    
    const form = document.createElement('form')
    form.classList.add('mx-3', 'mt-3')

    const row = document.createElement('div')
    row.classList.add('row')
  
    els.forEach(({ id, name, classes }) => {
      const col = document.createElement('div')
      col.classList.add('input-group', 'mb-3', [...classes])
  
      // CHECKBOX
      const checkbox = document.createElement('div')
      checkbox.classList.add('input-group-text')
      const check = document.createElement('input')
      check.classList.add('form-check-input', 'mt-0')
      check.type = 'checkbox'
      check.id = `${id}_checkbox`
      check.title = `Compter le ${name.toLowerCase()}`
      check.checked = true
      checkbox.appendChild(check)

      // FLOATING INPUT
      const floating = document.createElement('div')
      floating.classList.add('form-floating')

      const input = document.createElement('input')
      input.classList.add('form-control')
      input.type = 'number'
      input.id = `${id}_${unit}`
      input.placeholder = name
      input.value = getDimension(id, unit)
      input.min = 0
      input.addEventListener('input', event => {
        const { target } = event
        const { id, value } = target
    
        const [type, unit] = id.split('_')
        
        if (type && unit) {
          setDimension(type, value, unit)
          updateDOM(unit)
        }
      });

      const label = document.createElement('label');
      label.htmlFor = `${id}_${unit}`;
      label.innerHTML = name;

      floating.appendChild(input)
      floating.appendChild(label)
  
      // UNIT
      const span_unit = document.createElement('span')
      span_unit.classList.add('input-group-text')
      span_unit.innerHTML = unit
  
      col.appendChild(checkbox)
      col.appendChild(floating)
      col.appendChild(span_unit)
  
      row.appendChild(col)
    })
    form.appendChild(row)

    collapse.appendChild(unit_title)
    collapse.appendChild(total)
    collapse.appendChild(form)

    item.appendChild(header)
    item.appendChild(collapse)

    accordion.appendChild(item)

    if (parent.querySelector(`#${unit}_accordion`)) {
      parent.querySelector(`#${unit}_accordion`).replaceWith(accordion)
    } else {
      parent.appendChild(accordion)
    }
  })
}

const drawTable = () => {
  const parent = document.querySelector(`#table-container`)

  const table = document.createElement('table')
  table.classList.add('table', 'table-striped', 'table-hover')

  const thead = document.createElement('thead')  
  const tr = document.createElement('tr')
  headers.forEach(({ name }) => {
    const th = document.createElement('th')
    th.innerHTML = name
    tr.appendChild(th)
  })

  thead.appendChild(tr)

  const tbody = document.createElement('tbody')
  units.forEach(({ name, unit }) => {
    tbody.appendChild(document.createElement('tr'))

    headers.forEach(({ id }) => {
      const td = document.createElement('td')
      let inner = ''

      switch (id) {
        case 'unit':
          inner = name
          break;

        case 'total':
          inner = getDimension('handguard', unit) + getDimension('suppressor', unit)
          break;

        case 'diff':
          inner = getDimension('innerbarrel', unit) - (getDimension('handguard', unit) + getDimension('suppressor', unit))
          break;

        default:
          inner = getDimension(id, unit)
          break;
      }

      td.innerHTML = `${inner}${ id !== 'unit' ? unit : ''}`

      tbody.lastChild.appendChild(td)
    })
  })

  table.appendChild(thead)
  table.appendChild(tbody)

  if (parent.querySelector('table')) {
    parent.querySelector('table').replaceWith(table)
  } else {
    parent.appendChild(table)
  }
}

const updateDOM = (unit = null) => {
  drawBarrels()
  drawForms(unit)
  drawTable()
}

document.querySelector('#ratio').addEventListener('click', ({ target }) => { ratio = target.value, drawBarrels() })
document.querySelector('#reset').addEventListener('click', () => { dimensions = { ...default_dimensions }, ratio = default_ratio, updateDOM() })
document.querySelector('#default').addEventListener('click', () => { default_dimensions = { ...dimensions }, default_ratio = ratio, updateDOM() })
document.querySelector('#save').addEventListener('click', () => {
  document.cookie = `dimensions=${JSON.stringify(dimensions)}`
  document.cookie = `ratio=${ratio}`
})
document.querySelector('#load').addEventListener('click', () => {
  const cookies = document.cookie.split('; ')
  const dimensions_cookie = cookies.find(cookie => cookie.startsWith('dimensions'))
  const ratio_cookie = cookies.find(cookie => cookie.startsWith('ratio'))

  if (dimensions_cookie) {
    const dimensions_value = dimensions_cookie.split('=')[1]
    dimensions = JSON.parse(dimensions_value)
    console.log({ dimensions})
  }

  if (ratio_cookie) {
    const ratio_value = ratio_cookie.split('=')[1]
    ratio = ratio_value
    console.log({ ratio })
    document.querySelector('#ratio').value = ratio
  }

  updateDOM()
})

updateDOM()