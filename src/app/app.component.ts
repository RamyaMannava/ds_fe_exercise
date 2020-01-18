import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelmetService } from './helmet.service';
import { isNullOrUndefined, isNull } from 'util';
import { isNil } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  jsonResponse:any;
  public searchResults: any[] = [];
  public resetFilters: any[] = [];
  baseurl:string = 'https://asset.lemansnet.com/';
  endurl:string = '.png?x=176&y=176&b=&t=image/png';
  minprice:string;
  maxprice:string;
  minPriceErrorMsg:string = '';
  maxPriceErrorMsg:string = '';
  isMinPriceInvalid:boolean = false;
  isMaxPriceInvalid:boolean = false;
  constructor(private helmetService: HelmetService) {
  }
 
  ngOnInit() {
    this.searchResults = [];
    // retreiving json 
      this.helmetService.getData()
      .subscribe(res => {        
        this.jsonResponse= res;
        
        if (!isNil(this.jsonResponse.result['hits'])) {
          this.jsonResponse.result['hits'].map(dto => {
          let helmetDto = {
            assetName: '',
            brandName: '',
            minimumPrice:Number,
            maximumPrice:Number,
            mediaUrl:'',
            finalurl:''
          }
          if (!isNullOrUndefined(dto)) {
            helmetDto.assetName = dto.name;
            helmetDto.brandName = dto.brand.name;
            helmetDto.minimumPrice = dto.partSummary.priceRanges.retail.start;
            helmetDto.maximumPrice = dto.partSummary.priceRanges.retail.end;            
            helmetDto.mediaUrl = dto.media[0].url;
            helmetDto.finalurl = this.baseurl + helmetDto.mediaUrl + this.endurl;
            this.searchResults.push(helmetDto);
          }
                     
          });
      }
      this.resetFilters = this.searchResults;
      });
    
  }   

  //filter logic
applyFilter() {
  if(!isNull(this.minprice) && !isNull(this.maxprice)){
    this.minprice = this.minprice.toString().replace('$','');
    this.maxprice = this.maxprice.toString().replace('$','');    
    this.searchResults = this.resetFilters;
    let filterResults:any = [];
    
    if(!this.isMinPriceInvalid && !this.isMaxPriceInvalid) {
      filterResults = this.searchResults.filter(product =>
        (product.minimumPrice >= this.minprice
          && product.maximumPrice <= this.maxprice)     
      );
    }
    this.searchResults = filterResults;
  }
}

//minimum price input filed validation
  validateMinPrice() {
    if (!isNullOrUndefined(this.minprice)) {
    this.minPriceErrorMsg = '';
    const priceregExp = new RegExp(/^[0-9]+(\.[0-9]{1,2})?$/);
   if (!priceregExp.test(this.minprice)) {
      this.isMinPriceInvalid = true;
      this.minPriceErrorMsg =  'Please enter valid price';
     } else  if( !isNullOrUndefined(this.maxprice) && (parseFloat(this.minprice.toString().replace('$','')) > parseFloat(this.maxprice.toString().replace('$','')))) {
      this.isMinPriceInvalid = true;
      this.minPriceErrorMsg =  'Minimum Price should be less than Maximum Price';
     } else {
      this.isMinPriceInvalid = false
      this.minPriceErrorMsg = '';
    }
      }
  }

  //maximum price input filed validation
  validateMaxPrice() {
    if (!isNullOrUndefined(this.maxprice)) {
    this.maxPriceErrorMsg ='';
    const priceregExp = new RegExp(/^[0-9]+(\.[0-9]{1,2})?$/);
    if( parseFloat(this.maxprice.toString().replace('$','')) < parseFloat(this.minprice.toString().replace('$',''))) {
      this.isMaxPriceInvalid = true;
      this.maxPriceErrorMsg =  'Maximum Price should be greater than Minimum Price';
    } else if (!priceregExp.test(this.maxprice)) {
      this.isMaxPriceInvalid = true;
      this.maxPriceErrorMsg =  'Please enter valid price';
    } else  {
      this.isMaxPriceInvalid = false
      this.maxPriceErrorMsg = '';
    }
  }
  }
 
 }
