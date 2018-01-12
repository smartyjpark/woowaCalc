import Woowahan from 'woowahan';
import template from './index.handlebars';
import {CalcView} from '../calc'

export const Test = Woowahan.View.create('Main', {
  template,
  events: {
    "click .btn": "onClickButton"
  },

  initialize() {
    this.earlyModel = {
      time: new Date(),
      currData: "",
      ansData: "",
      isAns: false
    };
    this.setModel(this.earlyModel);
    this.lastInput = "";
    this.lastNumber = "";
    this.super()
  },

  viewWillMount(renderData) {

    return renderData;
  },

  viewDidMount() {

    this.updateView('[data-ref=calcViewContainer]', CalcView)
  },

  viewWillUnmount() {
    console.log('unmount')
  },

  saveAndUpdate(model) {
    this.setModel(model);
    this.updateView('[data-ref=calcViewContainer]', CalcView, this.getModel())
  },

  insertValue(value) {
    const model = this.getModel();

    if(model.isAns && Number.isInteger(parseInt(this.lastInput))) {
      console.log("hi");
      model.currData = "";
    }
    model.currData += value;
    model.isAns = false;
    this.saveAndUpdate(model)
  },

  onClickButton(event) {
    const target = event.target;
    const value = target.dataset.value.toString();
    switch (target.dataset.ref) {
      case 'number' :
        this.inputNumber(value);
        break;
      case 'operator' :
        this.runOperator(value);
        break;
      case 'func' :
        this.runFunc(value);
        break;
    }
  },

  inputNumber(number) {
    if (this.getModel('currData') === "0" && number) return false;
    this.lastInput = number;
    this.lastNumber += number;
    this.insertValue(number)
  },

  runOperator(operator) {
    if (!Number(this.lastInput) && this.lastInput !== "0") return false;
    this.lastInput = operator;
    this.lastNumber = "";
    this.insertValue(operator);
  },

  runFunc(funcName) {
    switch (funcName) {
      case "=":
        const returnValue = eval(this.getModel().currData).toString();
        if (returnValue) this.getResultValue(returnValue);
        break;

      case "CE":
        const model = this.getModel();
        if (model.isAns) {
          model.isAns = false;
          model.currData = '';
          this.lastNumber = '';
          this.lastInput = '';
          this.saveAndUpdate(model)
          return;
        }
        model.currData = model.currData.slice(0, -1);
        this.lastInput = model.currData[model.currData.length - 1];
        this.saveAndUpdate(model);
        break;

      case "(":
        break;

      case ")":
        break;

      case ".":
        if (this.lastNumber.includes(funcName) || !Number.isInteger(parseInt(this.lastInput))) return false;
        this.lastInput = funcName;
        this.lastNumber += funcName;
        this.insertValue(funcName);
        break;
    }
  },

  getResultValue(value) {
    const model = this.getModel();
    model.currData = value.toString();
    model.ansData = model.currData;
    model.isAns = true;
    this.saveAndUpdate(model);
    this.lastNumber = model.currData;
    this.lastInput = this.lastNumber.slice(0, -1);
    this.setModel(model);
  }

});
