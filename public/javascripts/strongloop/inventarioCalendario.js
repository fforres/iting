var calendar = $("#inventario #calendar").calendar(
{
    tmpl_path: "/tmpls/",
    events_source: function () { return []; }
});     