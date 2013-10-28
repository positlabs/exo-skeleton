![alt tag](https://raw.github.com/positlabs/exo-skeleton/master/app/assets/imgs/exo-logo_120.png)

exo-skeleton
============
Project scaffolding for web apps. At the core, it used Backbone / Layoutmanager (which depend on jQuery and underscore).
It also comes with some optional goodies like support for LESS CSS and Jade templates.


Using exo-skeleton
-----------------
Use [Yeoman][1] to generate the exo-skeleton scaffolding. There is no need to fork this repository.

0. Install yo (if needed)
  `npm install -g yo`

1. Install the generator.
  `npm install -g generator-exo-skeleton`

2. cd to an empty directory, then run the generator.
  `yo exo-skeleton`


Grunt tasks
------------------
`grunt watcher`: watch files that need to be pre-processed (.less, .jade).

`grunt server`: starts a local server, watches files, and opens a page to view the project on

`grunt build`: builds a distributable version of the site

`grunt deploy`: uploads the site to a server

`grunt`: builds and deploys



Included in exo-skeleton
------------------
* Backbone: http://backbonejs.org
* LayoutManager: https://layoutmanager.org
* LESS CSS: http://lesscss.org/
* JADE HTML: http://jade-lang.com/reference/
* Underscore: http://underscorejs.org
* jQuery: http://jquery.com/

[1]: http://yeoman.io/ "Yeoman"
