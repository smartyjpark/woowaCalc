import Woowahan from 'woowahan';
import template from './index.handlebars';
import {CalcView} from '../calc'

export const Main = Woowahan.View.create('Main', {
  template,
  events: {
    "click .btn": "onClickButton"
  },

  initialize() {
    this.earlyModel = {
      time: new Date(),
      currData: "",
      ansData: "",
      isAns: false,
      howManyOpend : 0
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

  },

  saveAndUpdate(model) {
    this.setModel(model);
    this.updateView('[data-ref=calcViewContainer]', CalcView, this.getModel())
  },

  insertValue(value) {
    const model = this.getModel();

    if((this.isInteger(this.lastInput)) && (model.isAns || model.currData === '0')) {
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
    if(this.lastInput === ')') return;
    this.lastInput = number;
    if(!(this.getModel('currData') === "0")) this.lastNumber += number;
    this.insertValue(number)
  },

  runOperator(operator) {
    if (!this.isInteger(this.lastInput)
      && operator !== '-'
      && this.lastInput !== ')') return false;
    this.lastInput = operator;
    this.lastNumber = "";
    this.insertValue(operator);
  },

  runFunc(funcName) {
    const model = this.getModel();
    switch (funcName) {
      case "=":
        const currData = this.getModel().currData;
        if (currData === '') return;
        const returnValue = eval(currData).toString();
        if (returnValue) this.getResultValue(returnValue);
        break;

      case "CE":
        if (model.isAns) {
          model.isAns = false;
          model.currData = '';
          this.lastNumber = '';
          this.lastInput = '';
          this.saveAndUpdate(model);
          return;
        }
        model.currData = model.currData.slice(0, -1);
        this.lastInput = model.currData[model.currData.length - 1];
        this.saveAndUpdate(model);
        break;

      case "(":
        if (this.isInteger(this.lastInput)
          || this.lastInput === (')' || '.')) return;
        this.lastInput = funcName;
        this.lastNumber = '';
        model.currData += funcName;
        model.howManyOpend ++;
        this.saveAndUpdate(model);
        break;

      case ")":
        if(model.howManyOpend === 0
          || !this.isInteger(this.lastInput)) return;
        this.lastInput = funcName;
        this.lastNumber = '';
        model.currData += funcName;
        model.howManyOpend --;
        this.saveAndUpdate(model);
        break;

      case ".":
        if (this.lastNumber.includes(funcName)
          || !this.isInteger(this.lastInput)) return false;
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
    this.lastInput = this.lastNumber[this.lastNumber.length - 1];
    this.setModel(model);
  },

  isInteger(value){
    return Number.isInteger(parseInt(value));
  }

});
