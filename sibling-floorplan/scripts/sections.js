function heavenSection(){
    var fund = randomFloat(430, 450);

    var h1 = new HeavenRamp(fund);
    var h2 = new HeavenRamp(fund * P4);
    var h3 = new HeavenRamp(fund * P5);
    
    h1.start(globalNow);
    h2.start(globalNow + 10);
    h3.start(globalNow + 20);
}
