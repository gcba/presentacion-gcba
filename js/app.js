/*

 Hack sobre Isotope para centrar luego de calcular la posición de cada item.
 Extraido desde: http://isotope.metafizzy.co/custom-layout-modes/centered-masonry.html

 */

$.Isotope.prototype._getCenteredMasonryColumns = function() {
	this.width = this.element.width();

	var parentWidth = this.element.parent().width();
	var colW = this.options.masonry && this.options.masonry.columnWidth || this.$filteredAtoms.outerWidth(true) || parentWidth;

	var cols = Math.floor(parentWidth / colW);
	cols = Math.max(cols, 1);

	this.masonry.cols = cols;
	this.masonry.columnWidth = colW;
};

$.Isotope.prototype._masonryReset = function() {
	this.masonry = {};
	this._getCenteredMasonryColumns();
	var i = this.masonry.cols;
	this.masonry.colYs = [];
	while (i--) {
		this.masonry.colYs.push(0);
	}
};

$.Isotope.prototype._masonryResizeChanged = function() {
	var prevColCount = this.masonry.cols;
	this._getCenteredMasonryColumns();
	return (this.masonry.cols !== prevColCount );
};

$.Isotope.prototype._masonryGetContainerSize = function() {
	var unusedCols = 0, i = this.masonry.cols;
	while (--i) {
		if (this.masonry.colYs[i] !== 0) {
			break;
		}
		unusedCols++;
	}

	return {
		height : Math.max.apply(Math, this.masonry.colYs),
		width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
	};
};

/*

 Función para crear el layout de isotope, ejecutado ni bien termina de parsearse el llamado a la api de Google Docs.

 Ref: proyectos

 */

function makeIsotope() {

	var $container = $('#container');
	var $select = $('#content select');
	var filters = {};

	$container.isotope({
		masonry : {
			columnWidth : 260,
			gutterWidth : 0
		},
		sortBy : 'elements',
		getSortData : {
			number : function($elem) {
				var number = $elem.hasClass('element') ? $elem.find('.number').text() : $elem.attr('data-number');
				return parseInt(number, 10);
			},
			eje : function($elem) {
				var eje = $elem.find('.subsecretaria'), itemText = eje.length ? eje : $elem;
				return itemText.text();
			},
			ministerio : function($elem) {
				var ministerio = $elem.find('.ministerio'), itemText = ministerio.length ? ministerio : $elem;
				return itemText.text();
			}
		}
	});

	$select.change(function() {
		var $this = $(this);

		var $optionSet = $this;
		var group = $optionSet.attr('data-filter-group');

		filters[group] = $this.find('option:selected').attr('data-filter-value');

		var isoFilters = [];
		for (var prop in filters) {
			isoFilters.push(filters[prop]);
		}
		var selector = isoFilters.join('');

		$container.isotope({
			filter : selector
		});

		return false;
	});

	var $optionSets = $('#options .option-set'), $optionLinks = $optionSets.find('a');

	$optionLinks.click(function() {
		var $this = $(this);
		if ($this.hasClass('selected')) {
			return false;
		}
		var $optionSet = $this.parents('.option-set');
		$optionSet.find('.selected').removeClass('selected');
		$this.addClass('selected');

		var options = {}, key = $optionSet.attr('data-option-key'), value = $this.attr('data-option-value');
		// parse 'false' as false boolean
		value = value === 'false' ? false : value;
		options[key] = value;
		if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
			changeLayoutMode($this, options);
		} else {
			$container.isotope(options);
		}

		return false;
	});

}

/*

 Esto no funciona, la idea es que al llegar a un lugar donde el color
 de la tipografía en el header no se lee, via Waypoints invertir el
 color, cambiando de clase.

 */


// Defino URL del spreadsheet.

var proyectos = 'https://docs.google.com/spreadsheets/d/ccc?key=1O4kOBcQ8vJdZGPItv6I-dfFwF8JC0NKrOMr5bWP4Oo8#gid=0';
//var proyectos = 'https://docs.google.com/spreadsheet/ccc?key=0Am2MaApvnHShdERKdGYwd1hOLUF6RHN0bHdOcUgtLXc#gid=3';

// Compilo plantilla de Handlebars template para los objetos del dashboard.
var HRTemplate = Handlebars.compile($('#hr-template').html());

// Load projects.
$('#container').sheetrock({
	url : proyectos,
	sql : "select *",
	chunkSize : 0,
	headersOff : true, 
	rowHandler : HRTemplate,
	rowGroups : false,
	userCallback : function() {
		console.log(proyectos);
		makeIsotope();
	}
});

var positionEjes = 4;

Handlebars.registerHelper('position', function() {
	return positionEjes++;
});

var positionProyectos = 10;

Handlebars.registerHelper('position-proyectos', function() {
	return positionProyectos++;
});

var slidesTemplate = Handlebars.compile($('#slides-template').html());

// Load projects.
$('#slides-container').sheetrock({
	url : proyectos,
	sql : "select *",
	chunkSize : 0,
	headersOff : true,
	rowHandler : slidesTemplate,
	rowGroups : false
});

$('#odd').on('change', function () {

	if (this.checked) {
		$('#container').isotope({
			filter : '.orden'
		});
	} else {
		$('#container').isotope({
			filter : ''
		});
	}

});
