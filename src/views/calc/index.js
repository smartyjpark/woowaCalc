import Woowahan from 'woowahan';
import template from './index.handlebars';

export const CalcView = Woowahan.View.create('CalcView', {
  template,

  initialize() {
    this.setModel({
      ansData: "",
      currData: "",
      isAns: false
    })
    this.super()
  },

  viewWillMount(renderData) {
    return renderData
  },

  viewDidMount() {

  },

  viewWillUnmount() {

  }

});
