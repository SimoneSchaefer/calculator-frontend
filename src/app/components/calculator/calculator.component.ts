import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CalulcatorService } from 'src/app/service/calulcator.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  operators = Operator;
  errorMessage: string | null = null;
  backendError: string | null = null;

  private currentFormula: string[] = [];
  private currentNumber: string = '';
  private destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(private calculatorService: CalulcatorService) { }

  ngOnInit(): void { }

  get formattedFormula() {
    return this.currentFormula.join(' ');
  }
  get formattedNumber() {
    return this.currentNumber.replace('.', ',')
  }

  numberClicked(numberInput: number) {
    this.resetErrorMessage();
    this.currentNumber += `${numberInput}`;
  }

  operatorClicked(operatorInput: Operator) {
    this.resetErrorMessage();
    if (this.currentNumber.length === 0) {
    } else {
      this.currentFormula.push(this.currentNumber);
      this.currentFormula.push(operatorInput);
      this.currentNumber = '';
    }
  }

  commaClicked() {
    this.resetErrorMessage();
    if (this.currentNumber.length === 0) {
      this.errorMessage = 'Bitte zuerst Zahl eingeben';
    } else {
      this.currentNumber += '.';
    }
  }

  clearClicked() {
    this.resetErrorMessage();
    this.currentNumber = '';
    this.currentFormula = [];
    this.resetErrorMessage();
  }

  deleteClicked() {
    this.resetErrorMessage();
    if (this.currentNumber.length > 0) {
      this.currentNumber = this.currentNumber.slice(0, -1)
    }
  }

  equalsClicked() {
    this.resetErrorMessage();
    if (!this.formulaValid()) {
      this.errorMessage = 'Bitte Formel angeben';
      return;
    }
    if (!this.currentNumberValid()) {
      this.errorMessage = 'Bitte korrekte Zahl angeben';
      return;
    }

    if (this.currentNumberValid()) {
      const formula = [...this.currentFormula];
      formula.push(this.currentNumber);
      this.calculatorService.calculate(formula.join('')).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (result: number) => this.setNewResult(result), 
        error: (e) => this.backendError = 'Das hat nicht geklappt :(' 
      });
    }
  }

  setNewResult(result: number) {
    this.currentFormula = [];
    this.currentNumber = `${result}`;
  }

  resetErrorMessage() {
    this.errorMessage = null;
  }

  private formulaValid() {
    return this.currentFormula.length > 0;
  }

  private currentNumberValid() {
    let isValid = this.currentNumber.length !== 0;
    if (!isValid) {
      return false;
    }
    if (this.currentNumber.endsWith(',')) {
      return false;
    }
    return isValid;
  }
}

enum Operator {
  PLUS = '+',
  MINUS = '-',
  MULTIPLY = '*',
  DIVIDE = '/'
}
