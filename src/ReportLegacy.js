/* 
 * Copyright (C) 2012-2013 Bitergia
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * This file is a part of the VizGrimoireJS package
 * Legacy code for VizJS for compatibility purposes
 *
 * Authors:
 *   Alvaro del Castillo San Felix <acs@bitergia.com>
 *   Daniel Izquierdo Cortazar <dizquierdo@bitergia.com>
 *   Luis Cañas <lcanas@bitergia.com>
 *
 */

var Report = {};

(function() {

Report.convertFlotr2 = function (config) {        
    // General config for metrics viz
    var config_metric = {};
            
    config_metric.show_desc = false;
    config_metric.show_title = false;
    config_metric.show_labels = true;
    
    if (config) {
        $.each(config, function(key, value) {
            config_metric[key] = value;
        });
    }
    
    var already_shown = [];
    var metric_already_shown = [];
    $.each(Report.getDataSources(), function(index, DS) {
        if (DS.getData().length === 0) return;
        $.each(DS.getMetrics(), function(name, metric) {
            var div_flotr2 = metric.divid+"-flotr2";
            if ($("#"+div_flotr2).length > 0 &&
                    $.inArray(metric.divid, metric_already_shown) === -1) {
                DS.displayBasicMetricHTML(name,div_flotr2, config_metric);
                // TODO: clean this hack
                metric_already_shown.push(metric.divid);
            }
            // Getting data real time
            var div_flotr2_rt = metric.divid+"-flotr2-rt";
            var divs = $("."+div_flotr2_rt);
            if (divs.length > 0) {
                $.each(divs, function(id, div) {
                    config_metric.realtime = true;
                    // config_metric.json_ds = "http://localhost:1337/?callback=?";
                    var db = "acs_cvsanaly_allura_1049";
                    db = $(this).data('db');
                    div.id = db + "_" + div.className;
                    config_metric.json_ds ="http://localhost:3000/scm/"+db+"/";
                    config_metric.json_ds += metric.divid+"_evol/?callback=?";
                    DS.displayBasicMetricHTML(i,div.id, config_metric);
                });
            }
        });
                    
        if ($("#"+DS.getName()+"-flotr2").length > 0) {
            if ($.inArray(DS.getName(), already_shown) === -1) {
                DS.displayBasicHTML(DS.getName()+'-flotr2', config_metric);
                already_shown.push(DS.getName());
            }
        }
        
        if (DS instanceof MLS) {
            if ($("#"+DS.getName()+"-flotr2"+"-lists").length > 0) {
                if (Report.getProjectsList().length === 1)
                    DS.displayBasic
                        (DS.getName() + "-flotr2"+"-lists", config_metric);
            }
        }
    
        // Multiparam
        var div_param = DS.getName()+"-flotr2-metrics";
        var divs = $("."+div_param);
        if (divs.length > 0) {
            $.each(divs, function(id, div) {
                var metrics = $(this).data('metrics');
                config_metric.help = true;
                var help = $(this).data('help');
                if (help !== undefined) config_metric.help = help;
                config_metric.show_legend = false;
                if ($(this).data('legend'))
                    config_metric.show_legend = true;
                if ($(this).data('frame-time'))
                    config_metric.frame_time = true;
                div.id = metrics.replace(/,/g,"-")+"-flotr2-metrics-"+this.id;
                DS.displayBasicMetrics(metrics.split(","),div.id,
                        config_metric, $(this).data('convert'));
            });
        }
    
        // Multiparam min
        div_param = DS.getName()+"-flotr2-metrics-min";
        divs = $("."+div_param);
        if (divs.length > 0) {
            $.each(divs, function(id, div) {
                var metrics = $(this).data('metrics');
                config_metric.show_legend = false;
                config_metric.show_labels = false;
                config_metric.show_grid = false;
                // config_metric.show_mouse = false;
                config_metric.help = false;
                div.id = metrics.replace(/,/g,"-")+"-flotr2-metrics-"+this.id;
                DS.displayBasicMetrics(metrics.split(","),div.id,
                        config_metric, $(this).data('convert'));
            });
        }
    
        
       // Time to fix
        var div_ttfix = DS.getName()+"-time-to-fix";
        divs = $("."+div_ttfix); 
        if (divs.length > 0) {
            $.each(divs, function(id, div) {
                var quantil = $(this).data('quantil');
                div.id = DS.getName()+"-time-to-fix-"+quantil;
                DS.displayTimeToFix(div.id, quantil);
            });
        }
        // Time to attention
        var div_ttatt = DS.getName()+"-time-to-attention";
        divs = $("."+div_ttatt); 
        if (divs.length > 0) {
            $.each(divs, function(id, div) {
                var quantil = $(this).data('quantil');
                div.id = DS.getName()+"-time-to-attention-"+quantil;
                DS.displayTimeToAttention(div.id, quantil);
            });
        }
    });
    };


})();
