require(['JBrowse/Browser','JBrowse/ConfigManager'], function( Browser, ConfigManager ) {

describe("ConfigManager", function () {
    it( "should work with a config with no includes", function() {
            var m = new ConfigManager({
                config: { foo: 1 },
                browser: new Browser({ unitTestMode: true }),
                skipValidation: true
            });
            var config;
            expect(m).toBeTruthy();
            waitsFor( function() { return config; }, 1000 );
            m.getFinalConfig( function(c) {
                config = c;
            });
            runs(function() {
                expect(config.foo).toEqual(1);
            });
    });

    it( "should work with a config with one include", function() {
            var m = new ConfigManager({
                config: {
                    include: [ '../data/conf/no_includes.json'],
                    overrideMe: 'rootConfig',
                    foo: 1,
                    tracks: [
                        { label: "zoo", zonk: "quux"},
                        { label: "zaz", honk: "beep", root: "root!"}
                    ]
                },
                browser: new Browser({ unitTestMode: true }),
                skipValidation: true
            });
            var config;
            expect(m).toBeTruthy();
            waitsFor( function() { return config; }, 1000 );
            m.getFinalConfig( function(c) {
                config = c;
            });
            runs(function() {
                expect(config.foo).toEqual(1);
                expect(config.bar).toEqual(42);
                expect(config.overrideMe).toEqual('rootConfig');

                expect(config.tracks.length).toEqual(3);
                expect(config.tracks[0].honk).toEqual('beep');
                expect(config.tracks[0].noinclude).toEqual('also here');
                expect(config.tracks[0].root).toEqual('root!');
                expect(config.tracks[0].label).toEqual('zaz');
                expect(config.tracks[1].label).toEqual('noinclude');
                expect(config.tracks[2].label).toEqual('zoo');
            });
    });

    it( "should work with a config with nested includes", function() {
            var m = new ConfigManager({
                config: {
                    include: [ '../data/conf/includes.json'],
                    overrideMe: 'rootConfig',
                    foo: 1,
                    tracks: [
                        { label: "zoo", zonk: "quux"},
                        { label: "zaz", honk: "beep", root: "root!"}
                    ]
                },
                browser: new Browser({ unitTestMode: true }),
                skipValidation: true
            });
            var config;
            expect(m).toBeTruthy();
            waitsFor( function() { return config; }, 1000 );
            m.getFinalConfig( function(c) {
                config = c;
            });
            runs(function() {
                expect(config.foo).toEqual(1);
                expect(config.bar).toEqual(42);
                expect(config.overrideMe).toEqual('rootConfig');
                expect(config.override2).toEqual('no_includes.json');
                expect(config.zoz).toEqual(42);

                expect(config.tracks.length).toEqual(4);

                expect(config.tracks[0].label).toEqual('zaz');
                expect(config.tracks[0].honk).toEqual('beep');
                expect(config.tracks[0].noinclude).toEqual('also here');
                expect(config.tracks[0].root).toEqual('root!');
                expect(config.tracks[0].quux).toEqual('foo');

                expect(config.tracks[1].label).toEqual('includes');
                expect(config.tracks[2].label).toEqual('noinclude');
                expect(config.tracks[3].label).toEqual('zoo');
            });
    });
});
});