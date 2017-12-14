window.TimelineRender = {

  renderTimeline(data) {

    return (
      <table>
        <tbody>
          <tr>
            {window.TimelineRenderHeader.renderMonths(data)}
          </tr>
          <tr>
            {window.TimelineRenderHeader.renderDays(data)}
          </tr>
          <tr>
            {window.TimelineRenderStatistics.renderTotals(data)}
          </tr>


        </tbody>
      </table>
    )
  }



}
