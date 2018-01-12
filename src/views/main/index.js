import Woowahan from 'woowahan';
import template from './index.handlebars';

export const Main = Woowahan.View.create('Main', {
  template,

  events: {
    "click .btn": "onClickButton"
  },

  initialize() {
    const model = {
      currentData: "",
      ansData: "",
      isAns: false,
      howManyOpened : 0
    };
    this.setModel(model);
    this.lastInput = "";
    this.lastNumber = "";
    this.super()
  },

  viewWillMount(renderData){

    return renderData
  },

  saveAndUpdate(model) {
    this.setModel(model);
    this.updateView()
  },

  insertValue(value) {
    const model = this.getModel();

    if((this.isInteger(this.lastInput)) && (model.isAns || model.currentData === '0')) {
      model.currentData = "";
    }

    model.currentData += value;
    model.isAns = false;
    this.saveAndUpdate(model)
  },

  onClickButton(event) {
    const target = event.currentTarget;
    const value = target.dataset.value;

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
    if(this.lastInput === ')') {
      return;
    }

    this.lastInput = number;

    if(!(this.getModel('currentData') === "0")) {
      this.lastNumber += number;
    }

    this.insertValue(number)
  },

  runOperator(operator) {
    if (!this.isInteger(this.lastInput)
      && operator !== '-'
      && this.lastInput !== ')') return;

    this.lastInput = operator;
    this.lastNumber = "";
    this.insertValue(operator);
  },

  runFunc(funcName) {
    const model = this.getModel();
    switch (funcName) {
      case "=":
        const currentData = this.getModel().currentData;
        if (currentData === '') return;

        try {
          const returnValue = eval(currentData).toString();

          if (returnValue) this.getResultValue(returnValue);
        } catch (error) { console.log(error); }
        break;

      case "CE":
        if (model.isAns) {
          model.isAns = false;
          model.currentData = '';
          this.lastNumber = '';
          this.lastInput = '';
          this.saveAndUpdate(model);
          return;
        }
        model.currentData = model.currentData.slice(0, -1);
        this.lastInput = model.currentData[model.currentData.length - 1];
        this.saveAndUpdate(model);
        break;

      case "(":
        if (this.isInteger(this.lastInput)
          || this.lastInput === (')' || '.')) return;
        this.lastInput = funcName;
        this.lastNumber = '';
        model.currentData += funcName;
        model.howManyOpened ++;
        this.saveAndUpdate(model);
        break;

      case ")":
        if(model.howManyOpened === 0
          || !this.isInteger(this.lastInput)) return;
        this.lastInput = funcName;
        this.lastNumber = '';
        model.currentData += funcName;
        model.howManyOpened --;
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
    model.currentData = value.toString();
    model.ansData = model.currentData;
    model.isAns = true;
    this.saveAndUpdate(model);
    this.lastNumber = model.currentData;
    this.lastInput = this.lastNumber[this.lastNumber.length - 1];
    this.setModel(model);
  },

  isInteger(value){
    return Number.isInteger(parseInt(value));
  }

});
