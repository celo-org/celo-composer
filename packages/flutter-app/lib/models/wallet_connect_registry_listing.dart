import 'package:flutter_web3/models/wc_reg_mobile.dart';

class WalletConnectRegistryListing {
  String? id;
  String? name;
  String? description;
  String? homepage;
  List<String>? chains;
  List<String>? versions;
  String? image_id;
  // late WcRegImageUrl image_url;
  // late WcRegApp app;
  late WcRegMobile mobile;
  // late WcRegDesktop desktop;
  // late WcRegMetadata metadata;

  // fromJson
  WalletConnectRegistryListing.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    description = json['description'];
    homepage = json['homepage'];
    chains = json['chains']?.cast<String>();
    versions = json['versions']?.cast<String>();
    image_id = json['image_id'];
    // image_url = json['image_url'] != null ? new WcRegImageUrl.fromJson(json['image_url']) : null;
    // app = json['app'] != null ? new WcRegApp.fromJson(json['app']) : null;
    mobile =
        (json['mobile'] != null ? WcRegMobile.fromJson(json['mobile']) : null)!;
    // desktop = json['desktop'] != null ? new WcRegDesktop.fromJson(json['desktop']) : null;
    // metadata = json['metadata'] != null ? new WcRegMetadata.fromJson(json['metadata']) : null;
  }
}
