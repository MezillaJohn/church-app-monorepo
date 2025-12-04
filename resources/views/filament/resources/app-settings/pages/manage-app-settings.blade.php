<x-filament-panels::page>
    <form wire:submit="save">
        {{ $this->form }}

        <x-filament::button type="submit" wire:loading.attr="disabled" style="margin-top: 15px;">
            Save Settings
        </x-filament::button>
    </form>
</x-filament-panels::page>
