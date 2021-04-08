import { Component, OnInit } from '@angular/core';
import { TextAnalyzerService } from '../text-analyzer.service';
import { TextModel } from './text-model';

@Component({
  selector: 'app-text-analyzer',
  templateUrl: './text-analyzer.component.html',
  styleUrls: ['./text-analyzer.component.css']
})
export class TextAnalyzerComponent implements OnInit {

  private type = [{ id: 1, name: 'Vowels' }, { id: 2, name: 'Consonants' }];
  private selection = null;
  private text: string;
  private currentState = '';
  private textModel: TextModel = { text: '', type: '' };
  private displayArray = [];
  private stateCheck: boolean;

  constructor(private textAnalyzerService: TextAnalyzerService) { }

  ngOnInit() {
    this.checkStatus();
    //this.serviceCall();
  }

  public checkStatus() {
    this.textAnalyzerService.checkAPIStatus().subscribe((response: any) => {
        this.stateCheck = true;
        this.currentState = 'online';
      },
    (error: any) => {
      if (error.status === 0) {
        this.stateCheck = false;
        this.currentState = 'offline';
      }
    });
  }

  // Handles the toggle state change
  public stateChanged() {
    this.checkStatus();
  }

  // Method to prevent user to enter whitespaces at the first position in the text input.
  keyDownHandler(event) {
    if (event.target.value.length > 0) { 
      return true; 
    } else if (event.keyCode === 32) {
          return false; } 
  } 

  // function to trigger text analysis
  public analyze() {
    let displayObj;
    this.textModel.type = this.selection;
    this.textModel.text = this.text;
    if (this.stateCheck) {
      this.serviceCall();
    } else {
      displayObj = { type: this.textModel.type, text: this.textModel.text, analysis: this.analyzeOffline() };
      this.displayArray.unshift(displayObj);
      this.analyzeOffline();
    }
  }

  // function to make API call 
  private serviceCall() {
    let type = this.selection;
    let text = this.text;
    let displayObj;
    this.textAnalyzerService.getAnalysisReport(this.textModel).subscribe((response: any) => {
      displayObj = { type: this.textModel.type, text: this.textModel.text, analysis: response };
      this.displayArray.unshift(displayObj);
    }, (error: any) => {
      if (error.status === 0) {
        this.stateCheck = false;
        this.currentState = 'offline';
        displayObj = { type: this.textModel.type, text: this.textModel.text, analysis: this.analyzeOffline() };
        this.displayArray.unshift(displayObj);
      }
    });
  }

  // To analyze offline
  public analyzeOffline() {
    let vowels = new Map();
    let analysisResult = new Map();
    vowels.set('A', 0);
    vowels.set('E', 0);
    vowels.set('I', 0);
    vowels.set('O', 0);
    vowels.set('U', 0);
    if (this.text) {
      const charArray = Array.from(this.text.toUpperCase());

      if (this.selection === "Vowels") {
        charArray.forEach(c => {
          if (vowels.has(c)) {
            let count = vowels.get(c);
            vowels.set(c, ++count);
          }
        });
        analysisResult = vowels;

      } else {
        let consonants = new Map();
        charArray.forEach(c => {
          if (!vowels.has(c) && c.toLowerCase() != c.toUpperCase()) {
            if (consonants.has(c)) {
              let count = consonants.get(c);
              consonants.set(c, ++count);
            } else {
              consonants.set(c, 1);
            }
          }
        });
        analysisResult = consonants;
      }
    }
    return analysisResult;
  }

}
