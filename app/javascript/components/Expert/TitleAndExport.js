import React from 'react'
import createReactClass from 'create-react-class'

/* eslint-disable react/prop-types */
export const TitleAndExport = createReactClass({
  propTypes: {},

  _exportQueryParams() {
    var fieldFilters = FetchInventory._buildFieldFilters(this.props.selectedValues)
    var params = {
      search_term: '',
      category_id: void 0,
      include_package_models: true,
      sort: 'name',
      order: 'ASC',
      field_filters: encodeURI(JSON.stringify(fieldFilters))
    }
    return params
  },

  _csvExportUrl() {
    return App.Inventory.url() + '/csv/expert' + '?' + $.param(this._exportQueryParams())
  },

  _excelExportUrl() {
    return App.Inventory.url() + '/excel/expert' + '?' + $.param(this._exportQueryParams())
  },

  _titleAndExport() {
    return (
      <div className="margin-top-l padding-horizontal-m">
        <div className="row">
          <div className="col1of3">
            <h1 className="headline-xl">{_jed('Inventory Advanced Search')}</h1>
          </div>
          <div className="col2of3">
            <div className="text-align-right">
              <div className="dropdown-holder inline-block">
                <div className="button white dropdown-toggle">
                  <i className="fa fa-table vertical-align-middle" />
                  {' Export '}
                  <div className="arrow down" />
                </div>
                <ul className="dropdown right">
                  <li>
                    <a className="dropdown-item" href={this._csvExportUrl()} id="csv-export" target="_blank">
                      CSV
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href={this._excelExportUrl()} id="excel-export" target="_blank">
                      Excel
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },

  render() {
    return this._titleAndExport()
  }
})
