/* 
 * Copyright (C) 2012 Bitergia
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
 *
 * Authors:
 *   Alvaro del Castillo San Felix <acs@bitergia.com>
 */

function SCM() {

    this.basic_metrics = {
        'scm_commits' : {
            'divid' : "scm_commits",
            'column' : "commits",
            'name' : "Commits",
            'desc' : "Evolution of the number of commits (aggregating branches)",
            'envision' : {
                y_labels : true,
                show_markers : true
            }
        },
        'scm_committers' : {
            'divid' : "scm_committers",
            'column' : "committers",
            'name' : "Committers",
            'desc' : "Unique committers making changes to the source code",
            'action' : "commits",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'scm_authors' : {
            'divid' : "scm_authors",
            'column' : "authors",
            'name' : "Authors",
            'desc' : "Unique authors making changes to the source code",
            'action' : "commits",
            'envision' : {
                gtype : 'whiskers'
            }
        }/*,
        'scm_authors_rev' : {
            'divid' : "scm_authors-rev",
            'column' : "authors_rev",
            'name' : "Authors",
            'desc' : "Unique authors making changes reviewed to the source code",
            'action' : "commits_rev",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'scm_commits_rev' : {
            'divid' : "scm_commits-rev",
            'column' : "commits_rev",
            'name' : "Commits Reviewed",
            'desc' : "Evolution of the number of commits reviewed (aggregating branches)",
            'envision' : {
                y_labels : true,
                show_markers : true
            }
        },
        'scm_reviewers' : {
            'divid' : "scm_reviewers",
            'column' : "reviewers",
            'name' : "Reviewers",
            'desc' : "Unique reviewers making reviews to the source code changes",
            'action' : "commits-rev",
            'envision' : {
                gtype : 'whiskers'
            }
        }*/,
        'scm_branches' : {
            'divid' : "scm_branches",
            'column' : "branches",
            'name' : "Branches",
            'desc' : "Evolution of the number of branches"
        },
        'scm_files' : {
            'divid' : "scm_files",
            'column' : "files",
            'name' : "Files",
            'desc' : "Evolution of the number of unique files handled by the community"
        },
        'scm_added_lines' : {
            'divid' : "scm_added_lines",
            'column' : "added_lines",
            'name' : "Lines Added",
            'desc' : "Evolution of the source code lines added"
        },
        'scm_removed_lines' : {
            'divid' : "scm_removed_lines",
            'column' : "removed_lines",
            'name' : "Lines Removed",
            'desc' : "Evolution of the source code lines removed"
        },
        'scm_repositories' : {
            'divid' : "scm_repositories",
            'column' : "repositories",
            'name' : "Repositories",
            'desc' : "Evolution of the number of repositories",
            'envision' : {
                gtype : 'whiskers'
            }
        },
        'scm_companies' : {
            'divid' : 'scm_companies',
            'column' : "companies",
            'name' : "Companies",
            'desc' : "Number of active companies"
        },
        'scm_countries' : {
            'divid' : 'scm_countries',
            'column' : "countries",
            'name' : "Countries",
            'desc' : "Number of active countries"
        },
        'scm_domains' : {
            'divid' : 'scm_domains',
            'column' : "domains",
            'name' : "Domains",
            'desc' : "Number of active domains"
        }/*,
        'scm_people' : {
            'divid' : 'scm_people',
            'column' : "people",
            'name' : "People",
            'desc' : "Number of active people"
        }*/
    };

    this.getMainMetric = function() {
        return "scm_commits";
    };

    this.setITS = function(its) {
        this.its = its;
    };

    this.getITS = function(its) {
        return this.its;
    };

    this.getTitle = function() {return "Source Code Management";};

    this.getSummaryLabels = function () {
        var id_label = {
                first_date:'Start',
                last_date:'End',
                /*actions:'Files actions',
                avg_commits_month:'Commits/month',
                avg_files_month:'Files/month',
                avg_authors_month:'Authors/month',
                avg_reviewers_month:'Reviewers/moth',
                avg_commits_week:'Commits/week',
                avg_files_week:'Files/week',
                avg_authors_week:'Authors/week',
                avg_reviewers_week:'Reviewers/week',
                avg_commits_author:'Commits/author',
                avg_files_author:'Files/author'*/
            };
        return id_label;
    };

    this.displayData = function(divid) {
        var div_id = "#" + divid;

        var str = this.global_data.url;
        if (!str || str.length === 0) {
            $(div_id + ' .scm-info').hide();
            return;
        }
        var repo_str =  this.global_data.type.charAt(0).toUpperCase() + this.global_data.type.slice(1);
        $(div_id + ' #scm_type').text(repo_str);
        var url = '';
        if (this.global_data.repositories === 1) {
            url = this.global_data.url;
        } else {
            url = Report.getProjectData().scm_url;
        }
        if (this.global_data.type === "git")
            if (url) url = url.replace("git://","http://");
        $(div_id + ' #scm_url').attr("href", url);
        $(div_id + ' #scm_name').text(repo_str);

        var data = this.getGlobalData();
        $(div_id + ' #scmFirst').text(data.first_date);
        $(div_id + ' #scmLast').text(data.last_date);
        $(div_id + ' #scmCommits').text(data.scm_commits);
        $(div_id + ' #scmAuthors').text(data.scm_authors);
        if (data.reviewers)
            $(div_id + ' #scmReviewers').text(data.scm_reviewers);
        $(div_id + ' #scmCommitters').text(data.scm_committers);
        $(div_id + ' #scmRepositories').text(data.scm_repositories);
        if (data.repositories === 1)
            $(div_id + ' #scmRepositories').hide();
    };

    this.displayBubbles = function(divid, radius) {
        Viz.displayBubbles(divid, "scm_commits", "scm_committers", radius);
    };
}
SCM.prototype = new DataSource("scm");