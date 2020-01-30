/* global d3 $ */
// import List from 'list.js'
// import pipeService from '../../service/pipeService'
// import globalConfig from '../../service/globalConfig'
const Tabulator = require('tabulator-tables')
import './tabulator.min.css'

let DrawText= function (id) {	
	this.id = id
    this.divWidth = $('#' + id).width()
    this.divHeight = $('#' + id).height()
    // this.margin = { top: 50, right: 100, bottom: 10, left: 100 }
    // this.width = this.divWidth - this.margin.left - this.margin.right
    // this.height = this.divHeight - this.margin.top - this.margin.bottom

    this.svg = d3.select('#' + id).append('div')
        .attr('id', 'sentence-table')
}

DrawText.prototype.layout = function (data) {
    console.log('text data: ', data)  /* eslint-disable-line */
    const _this = this
    _this.svg.selectAll('*').remove()

    // weakwords statistics
    let weakwords_dict = new Array()

    data['results'].map(function(d){
        if(d.hasOwnProperty('keywords')){
            d['keywords'].map(function(d_){
                if(weakwords_dict.length>=1){
                    // if weakword dict already exists
                    weakwords_dict.map(function(w,i){
                        if(w.hasOwnProperty(d_['keyword'])){ // if weakwords in dict
                            weakwords_dict[i]['value'] = weakwords_dict[i]['value']+1
                            weakwords_dict[i]['segmentId'].push(d['segmentId'])
                        }else{
                            let a = {}
                            let b = new Array()
                            b.push(d['segmentId'])
                            a[d_['keyword']] = {'value':1,'segmentId':b}
                            weakwords_dict.push(a)
                        }
                    })
                }else{
                    let a = {}
                    let b = new Array()
                    b.push(d['segmentId'])
                    a[d_['keyword']] = {'value':1,'segmentId':b}
                    weakwords_dict.push(a)
                }
            })
        }
    })

    console.log(weakwords_dict)

    let total_words = 0
    // total words length
    data['results'].map(function(d){
        total_words = total_words+d['word_confidence'].length
    })
    console.log('# of words:',total_words)

    let tableData = new Array()
    let sentenceData = new Array()

    
    var table = new Tabulator("#weakword-table", {
        // data:tableData, //set initial table data
        height:"300px",
        layout:"fitColumns",
        selectable: 1,
        columns:[
            {title:"ID", field:"id",align:"left",width:"10%"},
            {title:"Weak Words", field:"wword",headerFilter:"input",width:"40%"},
            {
                title:"Frequency", 
                columns:[
                    {title: "ratio", field:"ratio", formatter:"progress", sorter:"number", width:"30%"},
                    {title: "freq.", field:"freq", sorter:"number", align:"right", width:"20%"},
                ]
            }
        ],
        rowClick:function(e, row){
            //e - the click event object
            //row - row component
    
            row.toggleSelect(); //toggle row selected state on row click
            let weakword = row['_row']['data']['wword']
            sentenceData = []
            weakwords_dict.map(function(d){
                if(Object.keys(d)==weakword){
                    let segment = d[weakword]['segmentId']
                    segment.map(function(d){
                        sentenceData.push({
                            'segmentId':d,
                            'sentence':data['results'][d]['transcript'],
                        })
                    })

                    // get sentence rows
                    // let sentence_rows = sentence.getRows()
                    
                    // if(sentence_rows.length>=1){
                    //     sentence_rows.map(function(d,i){
                    //         sentence.deleteRow(i)
                    //     })
                    // }
                    sentence.setData(sentenceData)
                }
            })
            
        },
    });
    // sentence table
    var sentence = new Tabulator("#sentence-table", {
        // data:tableData, //set initial table data
        layout:"fitColumns",
        columns:[
            {title:"sentence ID", field:"segmentId",align:"left",width:"20%"},
            {title:"Transcript", field:"sentence",width:"80%"},
            // {
            // title:"Time",
            // columns:[
            //     {title: "Start", field:"stime", align:"center" ,width:"15%"},
            //     {title: "End", field:"etime", align:"center", width:"15%"},
            // ]},
        ],
    });
    

    weakwords_dict.map(function(d,i){
        let key = Object.keys(d)[0]
        let val = d[key]['value']
        // let segment = d[key]['segmentId']
        tableData.push({
            id: (i+1),
            wword: key,
            ratio: val/total_words*100,
            freq: val,    
        })
        // segment.map(function(d){
        //     sentenceData.push({
        //         'segmentId':d,
        //         'sentence':data['results'][d]['transcript'],
        //     })
        // })
    })

    table.setData(tableData)


}

export default DrawText