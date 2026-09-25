package com.kidsreels

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.kidsreels.uripermission.UriPermissionPackage
import com.microsoft.codepush.react.CodePush
import com.microsoft.codepush.react.ReactHostHolder

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    // Instantiate packages first so CodePush.getInstance runs before getJSBundleFile.
    val packages =
      PackageList(this).packages.apply {
        add(UriPermissionPackage())
      }

    getDefaultReactHost(
      context = applicationContext,
      packageList = packages,
      jsBundleFilePath = CodePush.getJSBundleFile(),
    )
  }

  override fun onCreate() {
    super.onCreate()

    // Ensure CodePush is initialized before ReactHost loads the JS bundle.
    CodePush.getInstance(
      getString(R.string.CodePushDeploymentKey),
      applicationContext,
      BuildConfig.DEBUG,
    )
    CodePush.setReactHost(ReactHostHolder { reactHost })

    loadReactNative(this)
  }
}
