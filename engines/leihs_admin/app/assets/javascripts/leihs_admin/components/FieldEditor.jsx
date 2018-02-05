(() => {
  const React = window.React

  window.FieldEditor = window.createReactClass({
    propTypes: {
    },

    displayName: 'FieldEditor',

    getInitialState () {
      return {
      }
    },

    render () {

      return (
        <div>
          <div className='panel'>
            <div className='row'>
              <div className='col-sm-6'>
                <h1>Feld Editor</h1>
              </div>
            </div>
          </div>
        </div>
      )
    }
  })
})()
