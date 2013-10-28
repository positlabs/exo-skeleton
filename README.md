exo-skeleton
============
Project scaffolding for web apps. It also comes with some optional goodies.


Using exo-skeleton
-----------------
Use [Yeoman][1] to generate the exo-skeleton scaffolding. There is no need to fork this repository.

1. Install the generator.
  `npm install -g generator-exo-skeleton`

2. cd to the empty project directory, then run the generator.
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
