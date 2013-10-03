describe( "VizGrimoireJS library", function () {    
    beforeEach(function() {
        waitsFor(function() {
            return Loader.check_data_loaded();
        }, "It took too long to load data", 100);
      });    
    describe( "Report", function () {
        it("data files should be loaded", function () {
            waitsFor(function() {
                return Loader.check_data_loaded();
            }, "It took too long to load data", 100);
            runs(function() {
                expect(Loader.check_data_loaded()).toBeTruthy();
            });
        });
        
        var blocks = ["Navbar","Refcard","Footer"];
        it(blocks.join() + " should be loaded from file", function () {
            runs(function() {
                $.each(blocks, function(index, value) {buildNode(value);});
                $.each(blocks, function(index, value) {
                    Report.getBasicDivs()[value].convert();});
            });
            waitsFor(function() {
                var loaded = document.getElementsByClassName('info-pill');
                return (loaded.length > 1);
            }, "It took too long to convert " + blocks.join(), 500);
            runs(function() {
                $.each(blocks, function(index, value) {
                    expect(document.getElementById(value).childNodes.length)
                    .toBeGreaterThan(0);});
            });
        });
        
        describe( "html report should be converted", function () {        
            it("html MetricsEvolSet should be displayed", function () {
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        buildNode(DS.getName()+"-MetricsEvolSet", 'MetricsEvolSet',
                            {
                                'data-data-source': DS.getName(),
                            });
                    });
                    Report.convertMetricsEvolSet();
                    var envisionCreated = document.getElementsByClassName
                        ('envision-visualization');
                    expect(envisionCreated.length).toEqual
                        (Report.getDataSources().length);
                });        
            });
            it("html MetricsEvol should be displayed", function () {
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        $.each(DS.getMetrics(), function(i, metric) {
                            buildNode(DS.getName()+"-MetricsEvol-"+metric.column, 'MetricsEvol',
                              {
                                  'data-data-source': DS.getName(),
                                  'data-metrics': DS.getName()+"_"+metric.column
                              });
                        });
                    });
                    Report.convertBasicMetrics();
                    $.each(Report.getDataSources(), function(index, DS) {
                        var ds_metrics = DS.getData(); 
                        $.each(DS.getMetrics(), function(name, metric) {
                            if (ds_metrics[name] === undefined) return true;
                            var div_id = DS.getName()+"-MetricsEvol-"+metric.column;
                            div_id = name+"-"+DS.getName()+"-metrics-evol-"+div_id;
                            expect(document.getElementById(div_id)
                                    .childNodes.length).toBeGreaterThan(0);
                        });
                    });
                        
                });        
            });
            it("html top should be displayed", function () {               
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        buildNode(DS.getName()+"-Top", 'Top',
                            {
                                'data-data-source': DS.getName(),
                            });
                        buildNode(DS.getName()+"-Top-pie", 'Top',
                            {
                                'data-data-source': DS.getName(),
                                'data-graph':'pie'
                            });
                        buildNode(DS.getName()+"-Top-bars", 'Top',
                            {
                                'data-data-source': DS.getName(),
                                'data-graph':'bars'
                            });
                    });
                    Report.convertTop();
                });
                // TODO: JSON files for top should be loaded. 
                //       Change this load to global data loading
                waitsFor(function() {
                    return (document.getElementById("its-Top-bars")
                    .childNodes.length > 0);
                }, "It took too long to load data", 100);
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        if (DS.getName() === "scr") return;
                        expect(document.getElementById(DS.getName()+"-Top")
                                .childNodes.length).toBeGreaterThan(0);
                        expect(document.getElementById(DS.getName()+"-Top-pie")
                                .childNodes.length).toBeGreaterThan(0);
                        expect(document.getElementById(DS.getName()+"-Top-bars")
                                .childNodes.length).toBeGreaterThan(0);
                    });
                });        
            });
            it("html bubbles should be displayed", function () {
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        buildNode(DS.getName()+"-time-bubbles","Bubbles",
                                {
                                    'data-data-source': DS.getName()
                                });
                    });
                    var ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    Report.convertBasicDivsMisc();
                    var new_ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    // SCR and IRC does not support bubbles yet
                    var bubbles_ds = Report.getDataSources().length - 2;
                    expect(new_ncanvas-ncanvas).toEqual(bubbles_ds);
                });        
            });
            it("html demographics should be displayed", function () {
                function buildNodesDemographic(type) {
                    $.each(Report.getDataSources(), function(index, DS) {
                        if (DS.getName() !== "scr" && DS.getName() !== "irc")
                            buildNode(DS.getName()+"-demographics-"+type,
                                      DS.getName()+"-demographics-"+type,
                                    {
                                        'data-period': '0.25',
                                        'class': 'demographic-bars',
                                        'data-file':'data/json/'+DS.getName()+'-demographics-'+type+'.json',
                                        'style':'position: relative'
                                    });
                    });                    
                }
                var ncanvas = 0;
                runs(function() {
                    buildNodesDemographic('aging');
                    buildNodesDemographic('birth');
                    ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    Report.convertDemographics();
                });
                // TODO: JSON files for top should be loaded. 
                //       Change this load to global data loading
                waitsFor(function() {
                    return (document.getElementById("scm-demographics-birth")
                    .childNodes.length > 0);
                }, "It took too long to load data", 100);
                runs(function() {
                    var new_ncanvas = document.getElementsByClassName
                        ('flotr-titles').length;
                    expect(new_ncanvas-ncanvas).toEqual(6);
                });        
            });
            it("html selectors should be displayed", function () {
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        // TODO: SCM and ITS selectors not supported yet
                        if (DS.getName() === "mls")
                            buildNode(DS.getName()+"-selector");
                            buildNode(DS.getName()+"-flotr2-lists", "mls-dyn-list");
                            buildNode(DS.getName()+"-envision-lists");
                    });
                    Report.convertSelectors();
                });
                // TODO: Move JSON loading to global loading
                waitsFor(function() {
                        return (document.getElementById("form_mls_selector") != null);
                    }, "It took too long to load data", 100);               
                runs(function() {
                    $.each(Report.getDataSources(), function(index, DS) {
                        if (DS.getName() === "mls")
                            expect(document.getElementById
                                ("form_"+DS.getName()+"_selector")
                                .childNodes.length).toBeGreaterThan(0);
                    });
                });
            });
            it("html radar should be displayed", function () {
                runs(function() {                
                    buildNode("RadarActivity","radar");
                    buildNode("RadarCommunity","radar");
                    var ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    Report.convertBasicDivsMisc();
                    var new_ncanvas = document.getElementsByClassName
                        ('flotr-canvas').length;
                    expect(new_ncanvas-ncanvas).toEqual(2);
                });        
            });
//            it("html gridster should be displayed", function () {
//                runs(function() {
//                    buildNode("gridster","gridster");
//                    Report.getBasicDivs()["gridster"].convert(); 
//                    var grids = document.getElementsByClassName
//                        ('gs_w').length;
//                    expect(grids).toEqual(18);
//                });        
//            });
            it("html Treemap should be displayed", function () {               
                runs(function() {
                    buildNode("Treemap","treemap",
                            {'data-file':'data/json/treemap.json'});
                    Report.getBasicDivsMisc()["Treemap"].convert();
                });
                waitsFor(function() {
                    return (document.getElementsByClassName("treemap-node").length>0);
                }, "It took too long to load treemap data", 100);
                runs(function() {
                    var nodes = document.getElementsByClassName
                        ('treemap-node').length;
                    expect(nodes).toEqual(252);
                });        
            });

        });        
    });
    describe("VizGrimoireJS loaded", function() {
        it("should be present in the global namespace", function () {
            expect(Report).toBeDefined();
            expect(Viz).toBeDefined();
            var data_sources = Report.getDataSources();
            $.each(data_sources, function(index, DS) {
                expect(DS).toBeDefined();
            });
        });
    });
    
    describe("Data checking", function() {
        it("Evol metrics should be present in the Global metrics", function () {
            var data_sources = Report.getDataSources();
            $.each(data_sources, function(index, DS) {
                var global = DS.getGlobalData();
                var evol = DS.getData();
                for (field in evol) {
                    if (DS.getMetrics()[field]) {
                        expect(global[field]).toBeDefined();
                    }
                }
            });
        });
        it("Summable Evol metrics should sum Global metrics", function () {
            var data_sources = Report.getDataSources();
            // var summable_metrics= ['its_opened','its_closed','mls_sent','scm_commits','scr_sent'];
            var summable_metrics= ['its_opened','mls_sent','scm_commits','scr_sent'];
            $.each(data_sources, function(index, DS) {
                var global = DS.getGlobalData();
                var evol = DS.getData();
                for (field in evol) {
                    if (DS.getMetrics()[field]) {
                        if ($.inArray(field,summable_metrics)===-1) continue;
                        var metric_evol = evol[field];
                        var metric_total = 0;
                        for (var i=0; i<metric_evol.length;i++) {
                            metric_total += metric_evol[i];
                        }
                        expect(metric_total).toEqual(global[field]);
                    }
                }
            });            
        });
    });
    
    function checkDataReport(report) {
        if ($.inArray(report,['repos','companies','countries'])===-1) 
            return;
        var data_sources = Report.getDataSources();
        var repos = 0, repos_global = {}, repos_metrics = {};
        $.each(data_sources, function(index, DS) {
            if (report === "repos") {
                repos = DS.getReposData();
                repos_global = DS.getReposGlobalData();
                repos_metrics = DS.getReposMetricsData();
            }
            else if (report === "companies") {
                repos = DS.getReposData();
                repos_global = DS.getReposGlobalData();
                repos_metrics = DS.getReposMetricsData();
            }
            else if (report === "countries") {
                repos = DS.getReposData();
                repos_global = DS.getReposGlobalData();
                repos_metrics = DS.getReposMetricsData();
            }
            if (repos.length === 0) return;
            for (var i=0; i<repos.length; i++) {
                for (field in repos_metrics[repos[i]]) {
                    if (DS.getMetrics()[field]) {
                        expect(repos_global[repos[i]][field]).toBeDefined();
                    }
                }
            }
        });        
    }
    
    function capitaliseFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function checkVizReport(report) {
        if ($.inArray(report,['repos','companies','countries'])===-1) 
            return;
        var total_canvas = 0;
        var data_sources = Report.getDataSources();
        $.each(data_sources, function(index, DS) {
            var ds_name = DS.getName();
            if (ds_name === "scr") return;
            if (report === "repos")
                total_canvas += 2*DS.getReposData().length;
            else if (report === "companies")
                total_canvas += 2*DS.getCompaniesData().length;
            else if (report === "countries")
                total_canvas += 2*DS.getCountriesData().length;
            var metrics = "";
            if (ds_name === "scm") metrics = "scm_commits,scm_authors"; 
            if (ds_name === "its") metrics = "its_closed,its_closers";
            if (ds_name === "mls") metrics = "mls_sent,mls_senders"; 
            buildNode(ds_name+"-"+report+"-MiniCharts",
                    "FilterItemsMiniCharts",
                    {
                        'data-metrics': metrics,
                        'data-data-source': ds_name,
                        'data-filter': report
            });
        });
        var ncanvas = document.getElementsByClassName
            ('flotr-canvas').length;
        Report.convertFilterStudy(report);
        var new_ncanvas = document.getElementsByClassName
            ('flotr-canvas').length;
        expect(new_ncanvas-ncanvas).toEqual(total_canvas);
    }
    
    describe("Repositories checking", function() {
        it("All repositories should have Evol and Global metrics", function () {
            checkDataReport('repos');
        });
        it("Repositories basic viz should work", function() {
            checkVizReport("repos");
        });
    });
    describe("Companies checking", function() {
        it("All companies should have Evol and Global metrics", function () {
            checkDataReport('companies');
        });
        it("Companies basic viz should work", function() {
            checkVizReport("companies");
        });
    });
    describe("Countries checking", function() {
        it("All countries should have Evol and Global metrics", function () {
            checkDataReport('countries');
        });
        it("Countries basic viz should work", function() {
            checkVizReport("countries");
        });
    });
    describe("People checking", function() {
        it("Top 1 SCM developer should have Evol and Global metrics", function () {
            var ncanvas = 0, nds = 0;
            runs(function() {
                var data_sources = Report.getDataSources();
                var people_id = null, max_people_index = 0;
                var metrics = null;
                // Find developer with ITS, MLS and SCM activity
                $.each(data_sources, function(index, DS) {
                    if (DS.getName() === 'scr' || DS.getName() === 'irc') 
                        return;
                    var np = DS.getPeopleData().id.length;
                    if (np > max_people_index) max_people_index = np;
                    nds++;
                });
                for (var i=0; i<max_people_index; i++) {
                    var dev_found = true;
                    $.each(data_sources, function(index, DS) { 
                        if (DS.getName() === 'scr'|| DS.getName() === 'irc') 
                            return;
                        if ($.inArray(i,DS.getPeopleData().id)===-1) {
                            dev_found = false;
                            return false;
                        }
                    });
                    if (dev_found) {people_id = i; break;}
                }
                $.each(data_sources, function(index, DS) {
                    if (DS.getName() === 'scr' || DS.getName() === 'irc') 
                        return;
                    if (DS.getName() === 'scm') {
                        metrics = 'scm_commits';
                    }
                    else if (DS.getName() === 'its') {
                        metrics = 'its_closed';
                    }
                    else if (DS.getName() === 'mls') {
                        metrics = 'mls_sent';
                    }
                    buildNode(DS.getName()+"-people-metrics",
                            "PersonMetrics",
                          {
                              'data-metrics': metrics,
                              'data-data-source': DS.getName(),
                    });      
                });
                ncanvas = document.getElementsByClassName
                    ('flotr-canvas').length;
                Report.convertPeople(people_id,'');
            });
            waitsFor(function() {
                return (document.getElementsByClassName('flotr-canvas').length>=ncanvas+nds);
            }, "It took too long to load data", 100);               
            runs(function() {
                var new_ncanvas = document.getElementsByClassName
                    ('flotr-canvas').length;
                expect(new_ncanvas-ncanvas).toEqual(nds);
            });
        });
    });
    
    function buildNode (id, div_class, attr_map) {
        if (document.getElementById(id)) return;
        var node = document.createElement('div');
        document.body.appendChild(node);
        if (div_class)
            node.className = div_class;
        node.id = id;
        if (attr_map)
            $('#'+id).attr(attr_map);
        return node;
      }

      function destroyNode (node) {
        document.body.removeChild(node);
      }
});
