export function light(dm,tagName,p3){
    let light = new ht.Light();
    light.s({
        // 'light.type': 'point',
        'light.color': 'transparent',
        'light.range': 120,
        'light.disabled':true,
        'light.intensity':1.2
    });
    light.setTag(tagName);
    light.p3(p3);
    dm.add(light);
    return light;
}
