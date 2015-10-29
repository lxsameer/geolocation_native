package com.awesomeproject.location;

import android.os.Bundle;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;

import com.facebook.react.bridge.Callback;

public class MyLocationListener implements LocationListener {

    private Callback on_success;
    private Callback on_disabled = null;
    private Callback on_enabled = null;
    private Callback on_changed = null;

    public MyLocationListener(Callback success,
                              Callback disabled,
                              Callback enabled,
                              Callback changed) {
        this.on_success = success;
        this.on_disabled = disabled;
        this.on_enabled = enabled;
        this.on_changed = changed;
    }

    @Override
    public void onLocationChanged(final Location location) {
        this.on_success.invoke(location);
    }

    public void onProviderDisabled (String provider) {
        if (this.on_disabled != null) {
            this.on_disabled.invoke(provider);
        }
    }

    public void onProviderEnabled(String provider) {
        if (this.on_enabled != null) {
            this.on_enabled.invoke(provider);
        }

    }

    public void onStatusChanged (String provider, int status, Bundle extras) {
        if (this.on_changed != null) {
            this.on_changed.invoke(provider, status);
        }

    }

}
